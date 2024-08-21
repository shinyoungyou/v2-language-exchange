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
                var query = _context.Messages
                    .Where(
                        m => m.RecipientUsername == currentUserName && m.RecipientDeleted == false &&
                        m.SenderUsername == request.RecipientUserName ||
                        m.RecipientUsername == request.RecipientUserName && m.SenderDeleted == false &&
                        m.SenderUsername == currentUserName
                    )
                    .OrderBy(m => m.MessageSent)
                    .AsQueryable();

                var unreadMessages = query.Where(m => m.DateRead == null 
                    && m.RecipientUsername == currentUserName).ToList();

                if (unreadMessages.Any())
                {
                    foreach (var message in unreadMessages)
                    {
                        message.DateRead = DateTime.UtcNow;
                    }
                }
                var messages = await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();

                return Result<List<MessageDto>>.Success(messages);
            }
        }
    }
}