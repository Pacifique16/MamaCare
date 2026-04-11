using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _db;
    public MessagesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetConversation([FromQuery] int motherId, [FromQuery] int doctorId)
    {
        var messages = await _db.Messages
            .Where(m => m.MotherId == motherId && m.DoctorId == doctorId)
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto(
                m.Id, m.MotherId, m.DoctorId, m.Content,
                m.SentByDoctor, m.SentAt, m.IsRead))
            .ToListAsync();
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> Send(SendMessageDto dto)
    {
        var message = new Message
        {
            MotherId = dto.MotherId, DoctorId = dto.DoctorId,
            Content = dto.Content, SentByDoctor = dto.SentByDoctor
        };
        _db.Messages.Add(message);
        await _db.SaveChangesAsync();
        return Ok(new MessageDto(
            message.Id, message.MotherId, message.DoctorId,
            message.Content, message.SentByDoctor, message.SentAt, message.IsRead));
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var message = await _db.Messages.FindAsync(id);
        if (message is null) return NotFound();
        message.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok();
    }
}
