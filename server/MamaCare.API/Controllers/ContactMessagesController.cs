using Microsoft.AspNetCore.Mvc;
using MamaCare.API.DTOs;
using MamaCare.API.Services;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/contact-messages")]
public class ContactMessagesController : ControllerBase
{
    private readonly IContactMessagesService _service;

    public ContactMessagesController(IContactMessagesService service)
    {
        _service = service;
    }

    // POST /api/contact-messages
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactMessageRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var message = await _service.SubmitAsync(request);
        return Ok(new { message.Id, message.CreatedAt });
    }
}
