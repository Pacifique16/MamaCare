using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _db;
    public DoctorsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var doctors = await _db.Doctors
            .Include(d => d.User)
            .Select(d => new DoctorSummaryDto(
                d.Id, d.User.FullName, d.User.ProfileImageUrl,
                d.Specialty, d.LicenseNumber, d.Status, null))
            .ToListAsync();
        return Ok(doctors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var d = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        if (d is null) return NotFound();
        return Ok(new DoctorDetailDto(
            d.Id, d.User.FullName, d.User.Email, d.User.PhoneNumber,
            d.User.ProfileImageUrl, d.Specialty, d.LicenseNumber,
            d.Institution, d.YearsOfExperience, d.Bio, d.Status));
    }

    [HttpGet("{id}/patients")]
    public async Task<IActionResult> GetPatients(int id)
    {
        var patients = await _db.Appointments
            .Where(a => a.DoctorId == id)
            .Include(a => a.Mother).ThenInclude(m => m.User)
            .Select(a => a.Mother)
            .Distinct()
            .Select(m => new MotherSummaryDto(
                m.Id, m.User.FullName, m.User.ProfileImageUrl,
                m.GestationalWeek, m.CurrentTrimester, m.RiskLevel,
                m.ExpectedDueDate, m.WeightKg, m.Location))
            .ToListAsync();
        return Ok(patients);
    }

    [HttpGet("{id}/patients/priority")]
    public async Task<IActionResult> GetPatientsByPriority(int id)
    {
        var patients = await _db.Appointments
            .Where(a => a.DoctorId == id)
            .Include(a => a.Mother).ThenInclude(m => m.User)
            .Select(a => a.Mother)
            .Distinct()
            .Select(m => new MotherSummaryDto(
                m.Id, m.User.FullName, m.User.ProfileImageUrl,
                m.GestationalWeek, m.CurrentTrimester, m.RiskLevel,
                m.ExpectedDueDate, m.WeightKg, m.Location))
            .ToListAsync();

        // Sort: High → Medium → Low, then by gestational week descending
        var sorted = patients
            .OrderBy(p => p.RiskLevel == RiskLevel.High ? 0 : p.RiskLevel == RiskLevel.Medium ? 1 : 2)
            .ThenByDescending(p => p.GestationalWeek)
            .ToList();

        return Ok(sorted);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDoctorDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName, Email = dto.Email,
            PasswordHash = dto.Password, PhoneNumber = dto.PhoneNumber,
            Role = UserRole.Doctor
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var doctor = new Doctor
        {
            UserId = user.Id, Specialty = dto.Specialty,
            LicenseNumber = dto.LicenseNumber, Institution = dto.Institution,
            YearsOfExperience = dto.YearsOfExperience, Bio = dto.Bio
        };
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateDoctorDto dto)
    {
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        if (doctor is null) return NotFound();

        if (dto.FullName is not null) doctor.User.FullName = dto.FullName;
        if (dto.PhoneNumber is not null) doctor.User.PhoneNumber = dto.PhoneNumber;
        if (dto.Specialty is not null) doctor.Specialty = dto.Specialty;
        if (dto.LicenseNumber is not null) doctor.LicenseNumber = dto.LicenseNumber;
        if (dto.Institution is not null) doctor.Institution = dto.Institution;
        if (dto.YearsOfExperience.HasValue) doctor.YearsOfExperience = dto.YearsOfExperience.Value;
        if (dto.Bio is not null) doctor.Bio = dto.Bio;
        if (dto.Status.HasValue) doctor.Status = dto.Status.Value;

        await _db.SaveChangesAsync();
        return Ok(doctor);
    }

    [HttpPatch("{id}/verify")]
    public async Task<IActionResult> Verify(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        doctor.Status = DoctorStatus.Verified;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Doctor verified successfully" });
    }

    [HttpPatch("{id}/suspend")]
    public async Task<IActionResult> Suspend(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        doctor.Status = DoctorStatus.Inactive;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Doctor suspended" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        _db.Doctors.Remove(doctor);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
