using Application.Messages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly IMediator _mediator;
        public MessageHub(IMediator mediator, IHubContext<PresenceHub> presenceHub)
        {
            _mediator = mediator;
            _presenceHub = presenceHub;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var group = await _mediator.Send(new AddToGroup.Command{OtherUser = otherUser, ConnectionId = Context.ConnectionId});

            await Groups.AddToGroupAsync(Context.ConnectionId, group.Value.Name); // from Single R

            await Clients.Group(group.Value.Name).SendAsync("UpdatedGroup", group.Value);
           
            var messages = await _mediator.Send(new List.Query{RecipientUserName = otherUser});

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages.Value);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {   
            var group = await _mediator.Send(new RemoveFromMessageGroup.Command{ConnectionId = Context.ConnectionId});
            await Clients.Group(group.Value.Name).SendAsync("UpdatedGroup"); 
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Create.Command command)
        {
            var message = await _mediator.Send(command);

            var groupName = GetGroupName(message.Value.SenderUsername, message.Value.RecipientUsername);

            var group = await _mediator.Send(new MessageGroup.Query{GroupName = groupName});

            if (group.Value.Connections.Any(x => x.Username == message.Value.RecipientUsername) == false)
            {
                var connections = await PresenceTracker.GetConnectionsForUser(message.Value.RecipientUsername);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message.Value.SenderUsername);
                }
            }

            await Clients.Group(groupName).SendAsync("NewMessage", message.Value); 
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}"; // a -> z
        }
    }
}