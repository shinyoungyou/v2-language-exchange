using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class AddToGroup
    {
        public class Command : IRequest<Result<Group>>
        {
            public string OtherUser { get; set; }
            public string ConnectionId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Group>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Group>> Handle(Command request, CancellationToken cancellationToken)
            {
                var groupName = GetGroupName(_userAccessor.GetUsername(), request.OtherUser);
                var group = await _context.Groups
                    .Include(x => x.Connections)
                    .FirstOrDefaultAsync(x => x.Name == groupName);

                var connection = new Connection(request.ConnectionId, _userAccessor.GetUsername());

                if (group == null)
                {
                    group = new Group(groupName);
                    _context.Groups.Add(group);
                }

                group.Connections.Add(connection);

                var result = await _context.SaveChangesAsync() > 0;
                
                if (!result) return Result<Group>.Failure("Failed to add to group");
                
                return Result<Group>.Success(group);                
            }

            private string GetGroupName(string caller, string other)
            {
                var stringCompare = string.CompareOrdinal(caller, other) < 0;
                return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}"; // a -> z
            }
        }

    }
}