using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MothersController : ControllerBase
{
    private readonly AppDbContext _db;
    public MothersController(AppDbContext db) => _db = db;

    [HttpGet]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var mothers = await _db.Mothers
            .Include(m => m.User)
            .Select(m => new MotherSummaryDto(
                m.Id, m.User.FullName, m.User.ProfileImageUrl,
                m.GestationalWeek, m.CurrentTrimester, m.RiskLevel,
                m.ExpectedDueDate, m.WeightKg, m.Location))
            .ToListAsync();
        return Ok(mothers);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var m = await _db.Mothers.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == id);
        if (m is null) return NotFound();
        return Ok(new MotherDetailDto(
            m.Id, m.User.FullName, m.User.Email, m.User.PhoneNumber,
            m.User.ProfileImageUrl, m.DateOfBirth, m.Location,
            m.ExpectedDueDate, m.GestationalWeek, m.CurrentTrimester,
            m.WeightKg, m.RiskLevel, m.HasGestationalDiabetes,
            m.HasHypertension, m.Allergies, m.OnboardingComplete));
    }

    [HttpGet("{id}/vitals")]
    [Authorize]
    public async Task<IActionResult> GetVitals(int id)
    {
        var vitals = await _db.VitalRecords
            .Where(v => v.MotherId == id)
            .OrderByDescending(v => v.RecordedAt)
            .Select(v => new VitalRecordDto(
                v.Id, v.MotherId, v.BloodPressureSystolic, v.BloodPressureDiastolic,
                v.WeightKg, v.FetalHeartRate, v.Temperature, v.RecordedAt, v.Notes))
            .ToListAsync();
        return Ok(vitals);
    }

    [HttpGet("{id}/appointments")]
    [Authorize]
    public async Task<IActionResult> GetAppointments(int id)
    {
        var appts = await _db.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Where(a => a.MotherId == id)
            .OrderBy(a => a.ScheduledAt)
            .Select(a => new AppointmentDto(
                a.Id, a.MotherId, "", a.DoctorId,
                a.Doctor.User.FullName, a.ScheduledAt, a.Type, a.Status, a.Notes))
            .ToListAsync();
        return Ok(appts);
    }

    [HttpGet("{id}/triage")]
    [Authorize]
    public async Task<IActionResult> GetTriageSessions(int id)
    {
        var sessions = await _db.TriageSessions
            .Include(t => t.Mother).ThenInclude(m => m.User)
            .Where(t => t.MotherId == id)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TriageSessionDto(
                t.Id, t.MotherId, t.Mother.User.FullName, t.Symptoms,
                t.SeverityScore, t.DurationDescription, t.BloodPressureSystolic,
                t.BloodPressureDiastolic, t.HeartRate, t.Temperature,
                t.Outcome, t.AiRecommendation, t.CreatedAt))
            .ToListAsync();
        return Ok(sessions);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMotherDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName, Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), Role = UserRole.Mother
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var mother = new Mother
        {
            UserId = user.Id, DateOfBirth = DateTime.SpecifyKind(dto.DateOfBirth, DateTimeKind.Utc),
            Location = dto.Location, ExpectedDueDate = DateTime.SpecifyKind(dto.ExpectedDueDate, DateTimeKind.Utc),
            GestationalWeek = dto.GestationalWeek, CurrentTrimester = dto.CurrentTrimester,
            WeightKg = dto.WeightKg, HasGestationalDiabetes = dto.HasGestationalDiabetes,
            HasHypertension = dto.HasHypertension, Allergies = dto.Allergies
        };
        _db.Mothers.Add(mother);
        await _db.SaveChangesAsync();

        // Also create a Patient record so the admin Patients page shows this mother
        var patient = new Patient
        {
            FullName = dto.FullName,
            DateOfBirth = DateTime.SpecifyKind(dto.DateOfBirth, DateTimeKind.Utc),
            WeeksPregnant = dto.GestationalWeek,
            RiskLevel = PatientRiskLevel.Low,
            BloodType = PatientBloodType.Unknown,
        };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = mother.Id }, new { mother.Id, mother.UserId });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateMotherDto dto)
    {
        var mother = await _db.Mothers.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == id);
        if (mother is null) return NotFound();

        if (dto.Location is not null) mother.Location = dto.Location;
        if (dto.ExpectedDueDate.HasValue) mother.ExpectedDueDate = DateTime.SpecifyKind(dto.ExpectedDueDate.Value, DateTimeKind.Utc);
        if (dto.GestationalWeek.HasValue) mother.GestationalWeek = dto.GestationalWeek.Value;
        if (dto.CurrentTrimester.HasValue) mother.CurrentTrimester = dto.CurrentTrimester.Value;
        if (dto.WeightKg.HasValue) mother.WeightKg = dto.WeightKg.Value;
        if (dto.RiskLevel.HasValue) mother.RiskLevel = dto.RiskLevel.Value;
        if (dto.HasGestationalDiabetes.HasValue) mother.HasGestationalDiabetes = dto.HasGestationalDiabetes.Value;
        if (dto.HasHypertension.HasValue) mother.HasHypertension = dto.HasHypertension.Value;
        if (dto.Allergies is not null) mother.Allergies = dto.Allergies;
        if (dto.OnboardingComplete.HasValue) mother.OnboardingComplete = dto.OnboardingComplete.Value;

        // Sync Patient record when onboarding completes
        if (dto.OnboardingComplete == true)
        {
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.FullName == mother.User.FullName);
            if (patient != null)
            {
                if (dto.GestationalWeek.HasValue) patient.WeeksPregnant = dto.GestationalWeek.Value;
                if (dto.Location is not null) patient.Address = dto.Location;
                if (mother.User.PhoneNumber is not null) patient.PhoneNumber = mother.User.PhoneNumber;
                patient.RiskLevel = mother.HasHypertension || mother.HasGestationalDiabetes
                    ? PatientRiskLevel.High : PatientRiskLevel.Low;
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new { mother.Id, mother.OnboardingComplete });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var mother = await _db.Mothers.FindAsync(id);
        if (mother is null) return NotFound();
        _db.Mothers.Remove(mother);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
