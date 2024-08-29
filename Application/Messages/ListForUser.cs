using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Messages
{
    public class ListForUser
    {
        public class Query : IRequest<Result<PagedList<MessageDto>>>
        {
            public MessageParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<MessageDto>>>
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

            public async Task<Result<PagedList<MessageDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUsername = _userAccessor.GetUsername();

                var query = _context.Messages
                    .OrderByDescending(x => x.MessageSent)
                    .AsQueryable();
      
                query = request.Params.Container switch
                {
                    "Inbox" => query.Where(u => u.RecipientUsername == currentUsername 
                      && u.RecipientDeleted == false),
                    "Outbox" => query.Where(u => u.SenderUsername == currentUsername
                      && u.SenderDeleted == false),
                    _ => query.Where(u => u.RecipientUsername == currentUsername 
                      && u.RecipientDeleted == false && u.DateRead == null)
                };

                var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
               
                return Result<PagedList<MessageDto>>.Success(await PagedList<MessageDto>
                    .CreateAsync(messages, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}