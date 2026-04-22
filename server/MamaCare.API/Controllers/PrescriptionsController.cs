using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;
using System.Security.Claims;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/prescriptions")]
[Authorize]
public class PrescriptionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PrescriptionsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? motherId, [FromQuery] int? doctorId)
    {
        var query = _db.Prescriptions
            .Include(p => p.Doctor).ThenInclude(d => d.User)
            .AsQueryable();

        if (motherId.HasValue) query = query.Where(p => p.MotherId == motherId);
        if (doctorId.HasValue) query = query.Where(p => p.DoctorId == doctorId);

        var result = await query
            .OrderByDescending(p => p.IssuedAt)
            .Select(p => new PrescriptionDto(
                p.Id, p.MotherId, p.DoctorId, p.Doctor.User.FullName,
                p.MedicineName, p.Dosage, p.Frequency,
                p.Duration, p.Notes, p.IssuedAt))
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePrescriptionDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);
        if (doctor is null) return Unauthorized();

        var prescription = new Prescription
        {
            MotherId = dto.MotherId,
            DoctorId = doctor.Id,
            MedicineName = dto.MedicineName,
            Dosage = dto.Dosage,
            Frequency = dto.Frequency,
            Duration = dto.Duration,
            Notes = dto.Notes
        };
        _db.Prescriptions.Add(prescription);

        // Auto-notify mother via message
        var message = new Message
        {
            MotherId = dto.MotherId,
            DoctorId = doctor.Id,
            Content = $"💊 New Prescription: {dto.MedicineName} {dto.Dosage} — {dto.Frequency}{(dto.Duration != null ? $" for {dto.Duration}" : "")}. {(dto.Notes != null ? $"Note: {dto.Notes}" : "")} Check your Prescriptions tab for full details.",
            SentByDoctor = true
        };
        _db.Messages.Add(message);

        await _db.SaveChangesAsync();
        return Ok(new PrescriptionDto(
            prescription.Id, prescription.MotherId, prescription.DoctorId,
            doctor.User.FullName, prescription.MedicineName, prescription.Dosage,
            prescription.Frequency, prescription.Duration, prescription.Notes,
            prescription.IssuedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var prescription = await _db.Prescriptions.FindAsync(id);
        if (prescription is null) return NotFound();
        _db.Prescriptions.Remove(prescription);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
