using API.Services;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
  public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt => 
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either FlyIO
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = config.GetConnectionString("DefaultConnection");
                    opt.UseSqlite(connStr);
                }
            });
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000");
                });
            });
          
            services.AddScoped<TokenService>();
            services.AddHttpContextAccessor();

            return services;
        }
    }
}