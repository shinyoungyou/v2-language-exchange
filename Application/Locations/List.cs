using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Locations
{
    public class List
    {
        public class Query : IRequest<Result<IEnumerable<Location>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<IEnumerable<Location>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<IEnumerable<Location>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var locations = _context.Users
                    .OrderBy(u => u.UserName)
                    .Select(u => new Location
                    {
                        Username = u.UserName,
                        Position = new Position
                        {
                            Lat = u.Lat,
                            Lng = u.Lng
                        }
                    })
                    .ToListAsync();

                return Result<IEnumerable<Location>>
                    .Success(await locations);
            }
        }
  }
}