using System.Text.Json;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var userData = await File.ReadAllTextAsync("UserSeedData.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

                foreach (var user in users)
                {
                    user.UserName = user.UserName.ToLower();
                    user.Created = DateTime.SpecifyKind(user.Created, DateTimeKind.Utc);
                    user.LastActive = DateTime.SpecifyKind(user.LastActive, DateTimeKind.Utc);
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }  
        }
    }
}