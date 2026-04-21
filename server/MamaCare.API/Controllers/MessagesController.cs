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

    [HttpGet("conversations/{doctorId}")]
    public async Task<IActionResult> GetConversations(int doctorId)
    {
        var conversations = await _db.Messages
            .Where(m => m.DoctorId == doctorId)
            .GroupBy(m => m.MotherId)
            .Select(g => new
            {
                MotherId = g.Key,
                MotherName = g.First().Mother.User.FullName,
                MotherImage = g.First().Mother.User.ProfileImageUrl,
                MotherPhone = g.First().Mother.User.PhoneNumber,
                LastMessage = g.OrderByDescending(m => m.SentAt).First().Content,
                LastMessageAt = g.Max(m => m.SentAt),
                UnreadCount = g.Count(m => !m.IsRead && !m.SentByDoctor)
            })
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync();
        return Ok(conversations);
    }

    [HttpGet("mother/{motherId}")]
    public async Task<IActionResult> GetMotherConversation(int motherId)
    {
        // Single query: join doctors with message summaries
        var appointmentDoctorIds = await _db.Appointments
            .Where(a => a.MotherId == motherId)
            .Select(a => a.DoctorId)
            .Distinct()
            .ToListAsync();

        var messageDoctorIds = await _db.Messages
            .Where(m => m.MotherId == motherId)
            .Select(m => m.DoctorId)
            .Distinct()
            .ToListAsync();

        var allDoctorIds = appointmentDoctorIds.Union(messageDoctorIds).Distinct().ToList();

        if (!allDoctorIds.Any())
        {
            return Ok(await _db.Doctors
                .Where(d => d.Status == DoctorStatus.Verified)
                .Select(d => new
                {
                    doctorId = d.Id,
                    doctorName = d.User.FullName,
                    doctorImage = d.User.ProfileImageUrl,
                    doctorPhone = d.User.PhoneNumber,
                    specialty = d.Specialty,
                    lastMessage = (string?)null,
                    lastMessageAt = (DateTime?)null,
                    unreadCount = 0
                })
                .ToListAsync());
        }

        // Fetch doctors and message summaries in one query each, then join in memory
        var doctors = await _db.Doctors
            .Where(d => allDoctorIds.Contains(d.Id))
            .Select(d => new
            {
                doctorId = d.Id,
                doctorName = d.User.FullName,
                doctorImage = d.User.ProfileImageUrl,
                doctorPhone = d.User.PhoneNumber,
                specialty = d.Specialty
            })
            .ToListAsync();

        var messageGroups = await _db.Messages
            .Where(m => m.MotherId == motherId && allDoctorIds.Contains(m.DoctorId))
            .GroupBy(m => m.DoctorId)
            .Select(g => new
            {
                DoctorId = g.Key,
                LastMessage = g.OrderByDescending(m => m.SentAt).First().Content,
                LastMessageAt = g.Max(m => m.SentAt),
                UnreadCount = g.Count(m => !m.IsRead && m.SentByDoctor)
            })
            .ToListAsync();

        var result = doctors.Select(d =>
        {
            var g = messageGroups.FirstOrDefault(x => x.DoctorId == d.doctorId);
            return new
            {
                d.doctorId, d.doctorName, d.doctorImage, d.doctorPhone, d.specialty,
                lastMessage = g?.LastMessage,
                lastMessageAt = g?.LastMessageAt,
                unreadCount = g?.UnreadCount ?? 0
            };
        })
        .OrderByDescending(d => d.lastMessageAt)
        .ToList();

        return Ok(result);
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
