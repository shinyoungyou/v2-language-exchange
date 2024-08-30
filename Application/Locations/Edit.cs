using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OpenCage.Geocode;
using Persistence;

namespace Application.Locations
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string City { get; set; }
            public string Country { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Country).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IConfiguration _config;
            public Handler(DataContext context, IUserAccessor userAccessor, IConfiguration config)
            {
                _config = config;
                _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername());

                user.City = request.City ?? user.City;
                user.Country = request.Country ?? user.Country;

                var gc = new Geocoder(_config["OpenCage:ApiKey"]);

                var geocoderResponse = gc.Geocode($"{request.City}, {request.Country}", language: "en");

                var point = geocoderResponse.Results[0].Geometry;

                if (point != null) {
                    user.Lat = point.Latitude;
                    user.Lng = point.Longitude;
                }
          
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);
                
                return Result<Unit>.Failure("Problem updating profile");
            }
        }
   
    }
}