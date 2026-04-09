using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db) => _db = db;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var stats = new AdminStatsDto(
            TotalMothers: await _db.Mothers.CountAsync(),
            TotalDoctors: await _db.Doctors.CountAsync(),
            PendingDoctors: await _db.Doctors.CountAsync(d => d.Status == DoctorStatus.Pending),
            TodayAppointments: await _db.Appointments.CountAsync(a => a.ScheduledAt.Date == today),
            HighRiskMothers: await _db.Mothers.CountAsync(m => m.RiskLevel == RiskLevel.High),
            ActiveSessions: await _db.Doctors.CountAsync(d => d.Status == DoctorStatus.Verified)
        );
        return Ok(stats);
    }

    [HttpGet("verification-queue")]
    public async Task<IActionResult> GetVerificationQueue()
    {
        var queue = await _db.Doctors
            .Include(d => d.User)
            .Where(d => d.Status == DoctorStatus.Pending)
            .Select(d => new DoctorSummaryDto(
                d.Id, d.User.FullName, d.User.ProfileImageUrl,
                d.Specialty, d.LicenseNumber, d.Status, null))
            .ToListAsync();
        return Ok(queue);
    }
}
