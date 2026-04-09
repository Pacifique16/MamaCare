using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TriageController : ControllerBase
{
    private readonly AppDbContext _db;
    public TriageController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? motherId)
    {
        var query = _db.TriageSessions
            .Include(t => t.Mother).ThenInclude(m => m.User)
            .AsQueryable();

        if (motherId.HasValue) query = query.Where(t => t.MotherId == motherId);

        var result = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TriageSessionDto(
                t.Id, t.MotherId, t.Mother.User.FullName, t.Symptoms,
                t.SeverityScore, t.DurationDescription, t.BloodPressureSystolic,
                t.BloodPressureDiastolic, t.HeartRate, t.Temperature,
                t.Outcome, t.AiRecommendation, t.CreatedAt))
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var t = await _db.TriageSessions
            .Include(t => t.Mother).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(t => t.Id == id);
        if (t is null) return NotFound();
        return Ok(new TriageSessionDto(
            t.Id, t.MotherId, t.Mother.User.FullName, t.Symptoms,
            t.SeverityScore, t.DurationDescription, t.BloodPressureSystolic,
            t.BloodPressureDiastolic, t.HeartRate, t.Temperature,
            t.Outcome, t.AiRecommendation, t.CreatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTriageSessionDto dto)
    {
        // Simple AI outcome logic based on severity score
        var outcome = dto.SeverityScore switch
        {
            >= 8 => TriageOutcome.Emergency,
            >= 6 => TriageOutcome.Urgent,
            >= 4 => TriageOutcome.Monitor,
            _ => TriageOutcome.Normal
        };

        var recommendation = outcome switch
        {
            TriageOutcome.Emergency => "Immediate medical attention required. Call your doctor or go to the emergency room now.",
            TriageOutcome.Urgent => "Contact your doctor today. Do not delay seeking care.",
            TriageOutcome.Monitor => "Rest and monitor your symptoms. Contact your doctor if symptoms worsen.",
            _ => "Symptoms appear mild. Continue normal activities and stay hydrated."
        };

        // Update mother risk level if emergency
        if (outcome == TriageOutcome.Emergency || outcome == TriageOutcome.Urgent)
        {
            var mother = await _db.Mothers.FindAsync(dto.MotherId);
            if (mother is not null) mother.RiskLevel = RiskLevel.High;
        }

        var session = new TriageSession
        {
            MotherId = dto.MotherId, Symptoms = dto.Symptoms,
            SeverityScore = dto.SeverityScore, DurationDescription = dto.DurationDescription,
            BloodPressureSystolic = dto.BloodPressureSystolic,
            BloodPressureDiastolic = dto.BloodPressureDiastolic,
            HeartRate = dto.HeartRate, Temperature = dto.Temperature,
            Outcome = outcome, AiRecommendation = recommendation
        };
        _db.TriageSessions.Add(session);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = session.Id }, new TriageSessionDto(
            session.Id, session.MotherId, "", session.Symptoms, session.SeverityScore,
            session.DurationDescription, session.BloodPressureSystolic, session.BloodPressureDiastolic,
            session.HeartRate, session.Temperature, session.Outcome, session.AiRecommendation, session.CreatedAt));
    }
}
