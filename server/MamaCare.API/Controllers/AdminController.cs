using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMemoryCache _cache;
    private const string StatsCacheKey = "admin_stats";

    public AdminController(AppDbContext db, IMemoryCache cache)
    {
        _db = db;
        _cache = cache;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (_cache.TryGetValue(StatsCacheKey, out AdminStatsDto? cached))
            return Ok(cached);

        var today = DateTime.UtcNow.Date;
        var since = today.AddDays(-6);

        // Combine mother risk counts in one query
        var motherRisks = await _db.Mothers
            .GroupBy(m => m.RiskLevel)
            .Select(g => new { Risk = g.Key, Count = g.Count() })
            .ToListAsync();
        var highRisk   = motherRisks.FirstOrDefault(r => r.Risk == RiskLevel.High)?.Count   ?? 0;
        var mediumRisk = motherRisks.FirstOrDefault(r => r.Risk == RiskLevel.Medium)?.Count ?? 0;
        var lowRisk    = motherRisks.FirstOrDefault(r => r.Risk == RiskLevel.Low)?.Count    ?? 0;
        var totalMothers = highRisk + mediumRisk + lowRisk;

        // Combine doctor status counts in one query
        var doctorStatuses = await _db.Doctors
            .GroupBy(d => d.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();
        var totalDoctors   = doctorStatuses.Sum(d => d.Count);
        var pendingDoctors = doctorStatuses.FirstOrDefault(d => d.Status == DoctorStatus.Pending)?.Count  ?? 0;
        var activeSessions = doctorStatuses.FirstOrDefault(d => d.Status == DoctorStatus.Verified)?.Count ?? 0;

        // Combine triage outcome counts in one query
        var triageOutcomes = await _db.TriageSessions
            .GroupBy(t => t.Outcome)
            .Select(g => new { Outcome = g.Key, Count = g.Count() })
            .ToListAsync();
        var totalTriage   = triageOutcomes.Sum(t => t.Count);
        var successTriage = triageOutcomes
            .Where(t => t.Outcome == TriageOutcome.Normal || t.Outcome == TriageOutcome.Monitor)
            .Sum(t => t.Count);
        var triageRate = totalTriage > 0 ? Math.Round((double)successTriage / totalTriage * 100, 1) : 0;

        // Library stats in one query
        var libraryStats = await _db.LibraryArticles
            .GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Views = g.Sum(a => a.ViewCount) })
            .FirstOrDefaultAsync();
        var libraryViews = libraryStats?.Views ?? 0;

        var todayAppts = await _db.Appointments.CountAsync(a => a.ScheduledAt.Date == today);

        // Enrollment trend — one query
        var enrollments = await _db.Mothers
            .Include(m => m.User)
            .Where(m => m.User.CreatedAt.Date >= since)
            .GroupBy(m => m.User.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync();

        var trend = Enumerable.Range(0, 7).Select(i => {
            var date = since.AddDays(i);
            return new EnrollmentDayDto(date.ToString("ddd"), enrollments.FirstOrDefault(e => e.Date == date)?.Count ?? 0);
        }).ToList();

        var result = new AdminStatsDto(
            totalMothers, totalDoctors, pendingDoctors, todayAppts,
            highRisk, activeSessions, triageRate, libraryViews,
            lowRisk, mediumRisk, trend
        );

        _cache.Set(StatsCacheKey, result, TimeSpan.FromSeconds(30));
        return Ok(result);
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
