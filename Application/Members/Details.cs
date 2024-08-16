using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Members
{
    public class Details
    {
        public class Query : IRequest<Result<Member>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Member>>
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

            public async Task<Result<Member>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .Where(x => x.UserName == request.Username)
                    .ProjectTo<Member>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })   
                    .SingleOrDefaultAsync();

                if (user == null) return null;

                return Result<Member>.Success(user);
            }
        }
    }
}