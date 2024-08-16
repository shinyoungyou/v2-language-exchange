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

                request.UserParams.CurrentUsername = _userAccessor.GetUsername();

                // filter: gender, current user
                var gender = await _context.Users
                    .Where(x => x.UserName == _userAccessor.GetUsername())
                    .Select(x => x.Gender).FirstOrDefaultAsync();


                if (string.IsNullOrEmpty(request.UserParams.Gender))
                {
                    request.UserParams.Gender = gender == "male" ? "female" : "male";
                }

                if (string.IsNullOrEmpty(gender))
                {
                    request.UserParams.Gender = "All";
                }

                var query = _context.Users.AsQueryable(); 

                query = query.Where(u => u.UserName != request.UserParams.CurrentUsername);
                if (request.UserParams.Gender != "All")
                {
                    query = query.Where(u => u.Gender == request.UserParams.Gender);
                }

               // filter: minAge, maxAge 
                var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-request.UserParams.MaxAge - 1)); 
                var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-request.UserParams.MinAge));

                query = query.Where(u => u.Birthday > minDob && u.Birthday <= maxDob);

                // sort: order by
                query = request.UserParams.OrderBy switch 
                {
                    "created" => query.OrderByDescending(u => u.Created),
                    _ => query.OrderByDescending(u => u.LastActive)
                };

                var members = query.AsNoTracking().ProjectTo<Member>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() });

                var newPagedMembers = await PagedList<Member>.CreateAsync(members, 
                    request.UserParams.PageNumber,
                    request.UserParams.PageSize);

                return Result<PagedList<Member>>.Success(newPagedMembers);


            }
        }
  }
}