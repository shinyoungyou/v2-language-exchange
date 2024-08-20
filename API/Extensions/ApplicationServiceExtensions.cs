using API.Services;
using Application.Core;
using Application.Interfaces;
using Application.Members;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
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
                // var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;
                connStr = config.GetConnectionString("DefaultConnection");

                // if (env == "Development")
                // {
                //     opt.UseSqlite(connStr);
                // }
                // else
                // {
                    opt.UseSqlServer(connStr);
                // }
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
            services.AddMediatR(typeof(List.Handler));
            services.AddScoped<TokenService>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Edit>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<AzureBlobStorage>(config.GetSection("AzureBlobStorage"));
   
            return services;
        }
    }
}