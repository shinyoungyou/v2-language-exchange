using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

namespace Application.Messages
{
    public class MessageGroup
    {
        public class Query : IRequest<Result<Group>>
        {
            public string GroupName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Group>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Group>> Handle(Query request, CancellationToken cancellationToken)
            {
                var group = await _context.Groups
                    .Include(x => x.Connections)
                    .FirstOrDefaultAsync(x => x.Name == request.GroupName);
                
                return Result<Group>.Success(group);
            }
        }
    }
}