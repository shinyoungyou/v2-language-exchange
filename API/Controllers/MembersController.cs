using Application.Core;
using Application.Members;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        
        [HttpGet]
        public async Task<IActionResult> GetMembers([FromQuery]UserParams userParams)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { UserParams = userParams }));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetMember(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
        [HttpPut]
        public async Task<IActionResult> Edit(Member member)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Member = member }));
        }
    }
}