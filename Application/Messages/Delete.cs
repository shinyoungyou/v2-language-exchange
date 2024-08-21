using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Messages
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var username = _userAccessor.GetUsername();

                var message = await _context.Messages.FindAsync(request.Id);

                if (message.SenderUsername != username && message.RecipientUsername != username) 
                    return Result<Unit>.Failure("Failed to delete the message");

                if (message.SenderUsername == username) message.SenderDeleted = true;
                if (message.RecipientUsername == username) message.RecipientDeleted = true;

                if (message.SenderDeleted && message.RecipientDeleted)
                {
                    _context.Messages.Remove(message);
                }  

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the message");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}