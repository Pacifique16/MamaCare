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
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AppointmentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? doctorId, [FromQuery] int? motherId, [FromQuery] bool? today)
    {
        var query = _db.Appointments
            .Include(a => a.Mother).ThenInclude(m => m.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .AsQueryable();

        if (doctorId.HasValue) query = query.Where(a => a.DoctorId == doctorId);
        if (motherId.HasValue) query = query.Where(a => a.MotherId == motherId);
        if (today == true)
        {
            var todayDate = DateTime.UtcNow.Date;
            query = query.Where(a => a.ScheduledAt.Date == todayDate);
        }

        var result = await query
            .OrderBy(a => a.ScheduledAt)
            .Select(a => new AppointmentDto(
                a.Id, a.MotherId, a.Mother.User.FullName,
                a.DoctorId, a.Doctor.User.FullName,
                a.ScheduledAt, a.Type, a.Status, a.Notes))
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await _db.Appointments
            .Include(a => a.Mother).ThenInclude(m => m.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (a is null) return NotFound();
        return Ok(new AppointmentDto(
            a.Id, a.MotherId, a.Mother.User.FullName,
            a.DoctorId, a.Doctor.User.FullName,
            a.ScheduledAt, a.Type, a.Status, a.Notes));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        var appt = new Appointment
        {
            MotherId = dto.MotherId, DoctorId = dto.DoctorId,
            ScheduledAt = DateTime.SpecifyKind(dto.ScheduledAt, DateTimeKind.Utc), Type = dto.Type, Notes = dto.Notes
        };
        _db.Appointments.Add(appt);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = appt.Id }, appt);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAppointmentDto dto)
    {
        var appt = await _db.Appointments.FindAsync(id);
        if (appt is null) return NotFound();

        if (dto.ScheduledAt.HasValue) appt.ScheduledAt = DateTime.SpecifyKind(dto.ScheduledAt.Value, DateTimeKind.Utc);
        if (dto.Type.HasValue) appt.Type = dto.Type.Value;
        if (dto.Status.HasValue) appt.Status = dto.Status.Value;
        if (dto.Notes is not null) appt.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return Ok(appt);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appt = await _db.Appointments.FindAsync(id);
        if (appt is null) return NotFound();
        _db.Appointments.Remove(appt);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
