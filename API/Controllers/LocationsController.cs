using Application.Core;
using Application.Locations;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class LocationsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetMembersLocations([FromQuery]UserParams userParams)
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpPatch]
        public async Task<IActionResult> ChangeLocation(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}