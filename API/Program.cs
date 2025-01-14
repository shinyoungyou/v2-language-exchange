using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(opt => 
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self()
        .CustomSources("https://fonts.googleapis.com", "https://accounts.google.com/gsi/style")
        .UnsafeInline())
    .FontSources(s => s.Self()
        .CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self()
        .CustomSources("blob:", 
                       "https://randomuser.me/", 
                       "https://cdn-icons-png.flaticon.com", 
                       "https://languageexchange.blob.core.windows.net", 
                       "data:", 
                       "https://lh3.googleusercontent.com", 
                       "https://www.tandem.net"))
    .ScriptSources(s => s.Self()
        .CustomSources("https://accounts.google.com", 
                       "https://www.google.com/recaptcha/api.js", 
                       "https://www.gstatic.com",
                       "https://apis.google.com",
                       "https://maps.googleapis.com"))
    .ConnectSources(s => s.Self()
        .CustomSources("https://accounts.google.com", "https://apis.google.com", "https://api.mymemory.translated.net"))
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else 
{
    app.Use(async (context, next) => 
    {
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

// add cores before we get to Authorization.
// The browser is going to send a pre flight request to see if cors is available.
app.UseCors("CorsPolicy"); 

// Authentication always comes first
app.UseAuthentication(); 
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{   
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();