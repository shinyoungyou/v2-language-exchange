using Application.Core;
using Application.Interfaces;
using MediatR;

namespace Application.Members
{
     public class Username
    {
        public class Query : IRequest<Result<string>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<string>>
        {
            private readonly IUserAccessor _userAccessor;

            public Handler(IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
            }

            public async Task<Result<string>> Handle(Query request, CancellationToken cancellationToken)
            {
               return Result<string>.Success(_userAccessor.GetUsername());
            }
        }
    }
}