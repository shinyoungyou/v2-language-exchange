using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
  public class Create
    {
        public class Command : IRequest<Result<MessageDto>>
        {
            public string RecipientUsername { get; set; }
            public string Content { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Content).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var username = _userAccessor.GetUsername();

                if (username == request.RecipientUsername.ToLower()) 
                    return Result<MessageDto>.Failure("You cannot send messages to yourself");
                
                var sender = await _context.Users
                    .Include(p => p.Photos)   
                    .SingleOrDefaultAsync(x => x.UserName == username);

                var recipient = await _context.Users
                    .Include(p => p.Photos)   
                    .SingleOrDefaultAsync(x => x.UserName == request.RecipientUsername);

                if (recipient == null) return Result<MessageDto>.Failure("Not found user");;

                var groupName = GetGroupName(sender.UserName, recipient.UserName);

                var group = await _context.Groups
                    .Include(x => x.Connections)
                    .FirstOrDefaultAsync(x => x.Name == groupName);

                var message = new Message
                {
                    Sender = sender,
                    Recipient = recipient,
                    SenderUsername = sender.UserName,
                    RecipientUsername = recipient.UserName,
                    Content = request.Content
                };

                if (group.Connections.Any(x => x.Username == recipient.UserName))
                {
                    message.DateRead = DateTime.UtcNow;
                }

                _context.Messages.Add(message);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<MessageDto>.Failure("Failed to send message");

                return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message));                
            }

            private string GetGroupName(string caller, string other)
            {
                var stringCompare = string.CompareOrdinal(caller, other) < 0;
                return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}"; // a -> z
            }
        }
        
    }
}