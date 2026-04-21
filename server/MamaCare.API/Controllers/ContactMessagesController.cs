using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.DTOs;
using MamaCare.API.Services;
using MamaCare.API.Data;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/contact-messages")]
public class ContactMessagesController : ControllerBase
{
    private readonly IContactMessagesService _service;
    private readonly AppDbContext _db;

    public ContactMessagesController(IContactMessagesService service, AppDbContext db)
    {
        _service = service;
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactMessageRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);
        var message = await _service.SubmitAsync(request);
        return Ok(new { message.Id, message.CreatedAt });
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var messages = await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new { m.Id, m.Name, m.Email, m.Subject, m.Message, m.IsRead, m.CreatedAt })
            .ToListAsync();
        return Ok(messages);
    }

    [HttpPatch("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkRead(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return NotFound();
        msg.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok();
    }
}
