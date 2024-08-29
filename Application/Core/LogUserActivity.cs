using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace Application.Core
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var dbContext = resultContext.HttpContext.RequestServices.GetRequiredService<DataContext>();
            var user = await dbContext.Users.FindAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }
}