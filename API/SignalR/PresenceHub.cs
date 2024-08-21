using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            // var username = await _mediator.Send(new Username.Query());
            var isOnline = await _tracker.UserConnected(Context.User.FindFirstValue(ClaimTypes.Name), Context.ConnectionId);
            if (isOnline) 
                await Clients.Others.SendAsync("UserIsOnline", Context.User.FindFirstValue(ClaimTypes.Name));

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // var username = await _mediator.Send(new Username.Query());
            var isOffline = await _tracker.UserDisconnected(Context.User.FindFirstValue(ClaimTypes.Name), Context.ConnectionId);
            
            if (isOffline) 
                await Clients.Others.SendAsync("UserIsOffline", Context.User.FindFirstValue(ClaimTypes.Name));

            await base.OnDisconnectedAsync(exception);
        }
    }
}