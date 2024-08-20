using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Members
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<Member>>>
        {
            public UserParams UserParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<Member>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<Member>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // for caching
                request.UserParams.CurrentUsername = _userAccessor.GetUsername();

                // filter: gender, current user
                var gender = await _context.Users
                    .Where(u => u.UserName == _userAccessor.GetUsername())
                    .Select(u => u.Gender).FirstOrDefaultAsync();

                // if there's no gender property in the url 
                // such as /api/members?pageNumber=1&pageSize=5&minAge=18&maxAge=50&orderBy=lastActive
                // NOT /api/members?pageNumber=1&pageSize=5&minAge=18&maxAge=50&gender=Female&orderBy=lastActive
                if (string.IsNullOrEmpty(request.UserParams.Gender))
                {
                    request.UserParams.Gender = gender == "Female" ?  "Female" : "Male";
                }

                // if gender wasn't set in DB
                if (string.IsNullOrEmpty(gender))
                {
                    request.UserParams.Gender = "All";
                }

                var query = _context.Users.AsQueryable(); 

                // get members expect for me
                query = query.Where(u => u.UserName != request.UserParams.CurrentUsername);
                if (request.UserParams.Gender != "All")
                {
                    query = query.Where(u => u.Gender == request.UserParams.Gender);
                }

                // filter: minAge, maxAge 
                // when minAge: 18, maxAge: 50
                // 1973.08.18 < Dob ≤ 2006.08.18
                var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-request.UserParams.MaxAge - 1)); 
                var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-request.UserParams.MinAge));

                query = query.Where(u => u.Birthday > minDob && u.Birthday <= maxDob);

                // sort: order by
                query = request.UserParams.OrderBy switch 
                {
                    // get newer to older memeber
                    "created" => query.OrderByDescending(u => u.Created),
                    
                    // when orderBy wasn't set as created
                    // such as "lastActive", "create", ""
                    _ => query.OrderByDescending(u => u.LastActive)
                };

                // query.ProjectTo<Member>: AppUser -> Member
                var members = query.AsNoTracking().ProjectTo<Member>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() });

                // get only few memebrs by pagination setting
                var newPagedMembers = await PagedList<Member>.CreateAsync(members, 
                    request.UserParams.PageNumber,
                    request.UserParams.PageSize);

                return Result<PagedList<Member>>.Success(newPagedMembers);


            }
        }
  }
}