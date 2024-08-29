using Application.Messages;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetMessageForUser([FromQuery]MessageParams param)
        {
            return HandlePagedResult(await Mediator.Send(new ListForUser.Query { Params = param }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}