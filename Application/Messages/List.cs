using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class List
    {
        public class Query : IRequest<Result<List<MessageDto>>>
        {
            public string RecipientUserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<MessageDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<MessageDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserName = _userAccessor.GetUsername();
                // message: me <-> the other user
                var query = _context.Messages
                    .Where(
                        m => 
                            // message: the other user -> me
                            m.RecipientUsername == currentUserName && m.RecipientDeleted == false &&
                            m.SenderUsername == request.RecipientUserName 
                        ||
                            // message: me -> the other user
                            m.RecipientUsername == request.RecipientUserName && m.SenderDeleted == false &&
                            m.SenderUsername == currentUserName
                    )
                    .OrderBy(m => m.MessageSent)
                    .AsQueryable();

                // message: (the other user → me) && unread
                var unreadMessages = query.Where(m => m.DateRead == null 
                    && m.RecipientUsername == currentUserName);

                // b/c I've read all the messages the other user has sent on the frontend, 
                // I am now requesting the backend to reflect that I've read the messages.
                if (unreadMessages.Any())
                {
                    foreach (var message in unreadMessages)
                    {
                        message.DateRead = DateTime.UtcNow;
                    }

                    var result = await _context.SaveChangesAsync() > 0;

                    if (!result) return Result<List<MessageDto>>.Failure("Failed to mark unread as read");
                }
                
                var messages = await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();
                
                return Result<List<MessageDto>>.Success(messages);
            }
        }
    }
}