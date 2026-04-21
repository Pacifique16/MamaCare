using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        var d = await _db.Doctors
            .Include(d => d.User)
            .Include(d => d.Certifications)
            .FirstOrDefaultAsync(d => d.Id == id);
        if (d is null) return NotFound();
        return Ok(new DoctorDetailDto(
            d.Id, d.User.FullName, d.User.Email, d.User.PhoneNumber,
            d.User.ProfileImageUrl, d.Specialty, d.LicenseNumber,
            d.Institution, d.YearsOfExperience, d.Bio, d.Status, d.CertificationUrl,
            d.Certifications.OrderByDescending(c => c.UploadedAt)
                .Select(c => new CertificationDto(c.Id, c.FileName, c.Url, c.UploadedAt))
                .ToList(),
            string.IsNullOrEmpty(d.Languages)
                ? new List<string>()
                : d.Languages.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()));
    }

    [HttpGet("{id}/certifications")]
    public async Task<IActionResult> GetCertifications(int id)
    {
        var certs = await _db.DoctorCertifications
            .Where(c => c.DoctorId == id)
            .OrderByDescending(c => c.UploadedAt)
            .Select(c => new CertificationDto(c.Id, c.FileName, c.Url, c.UploadedAt))
            .ToListAsync();
        return Ok(certs);
    }

    [HttpPost("{id}/certifications")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddCertification(int id, AddCertificationDto dto)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        var cert = new DoctorCertification { DoctorId = id, FileName = dto.FileName, Url = dto.Url };
        _db.DoctorCertifications.Add(cert);
        await _db.SaveChangesAsync();
        return Ok(new CertificationDto(cert.Id, cert.FileName, cert.Url, cert.UploadedAt));
    }

    [HttpDelete("{id}/certifications/{certId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCertification(int id, int certId)
    {
        var cert = await _db.DoctorCertifications.FirstOrDefaultAsync(c => c.Id == certId && c.DoctorId == id);
        if (cert is null) return NotFound();
        _db.DoctorCertifications.Remove(cert);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/schedule")]
    public async Task<IActionResult> GetSchedule(int id)
    {
        var appointments = await _db.PatientAppointments
            .Where(a => a.DoctorId == id)
            .Include(a => a.Patient)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new {
                a.Id,
                PatientName = a.Patient.FullName,
                PatientImage = (string?)null,
                AppointmentDate = a.AppointmentDate,
                Type = a.Type.ToString(),
                Status = a.Status.ToString(),
                a.Notes
            })
            .ToListAsync();

        // Also include from Appointments (Mother-linked)
        var motherAppts = await _db.Appointments
            .Where(a => a.DoctorId == id)
            .Include(a => a.Mother).ThenInclude(m => m.User)
            .OrderBy(a => a.ScheduledAt)
            .Select(a => new {
                a.Id,
                PatientName = a.Mother.User.FullName,
                PatientImage = a.Mother.User.ProfileImageUrl,
                AppointmentDate = a.ScheduledAt,
                Type = a.Type.ToString(),
                Status = a.Status.ToString(),
                a.Notes
            })
            .ToListAsync();

        var combined = appointments.Cast<object>().Concat(motherAppts.Cast<object>())
            .OrderBy(a => ((dynamic)a).AppointmentDate)
            .ToList();

        return Ok(combined);
    }

    [HttpGet("{id}/activity")]
    public async Task<IActionResult> GetActivity(int id)
    {
        var appointments = await _db.PatientAppointments
            .Where(a => a.DoctorId == id)
            .Include(a => a.Patient)
            .OrderByDescending(a => a.CreatedAt)
            .Take(20)
            .Select(a => new {
                a.Id,
                PatientName = a.Patient.FullName,
                Type = a.Type.ToString(),
                Status = a.Status.ToString(),
                a.CreatedAt,
                a.AppointmentDate
            })
            .ToListAsync();
        return Ok(appointments);
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
                m.ExpectedDueDate, m.WeightKg, m.Location, m.User.PhoneNumber))
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
                m.ExpectedDueDate, m.WeightKg, m.Location, m.User.PhoneNumber))
            .ToListAsync();

        // Sort: High → Medium → Low, then by gestational week descending
        var sorted = patients
            .OrderBy(p => p.RiskLevel == RiskLevel.High ? 0 : p.RiskLevel == RiskLevel.Medium ? 1 : 2)
            .ThenByDescending(p => p.GestationalWeek)
            .ToList();

        return Ok(sorted);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateDoctorDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName, Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), PhoneNumber = dto.PhoneNumber,
            ProfileImageUrl = dto.ProfileImageUrl,
            Role = UserRole.Doctor
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var doctor = new Doctor
        {
            UserId = user.Id, Specialty = dto.Specialty,
            LicenseNumber = dto.LicenseNumber, Institution = dto.Institution,
            YearsOfExperience = dto.YearsOfExperience, Bio = dto.Bio,
            CertificationUrl = dto.CertificationUrl
        };
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync();
        return Ok(new { doctor.Id, doctor.UserId });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
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
        if (dto.Status is not null && Enum.TryParse<DoctorStatus>(dto.Status, out var parsedStatus))
            doctor.Status = parsedStatus;
        if (dto.ProfileImageUrl is not null) doctor.User.ProfileImageUrl = dto.ProfileImageUrl;
        if (dto.CertificationUrl is not null) doctor.CertificationUrl = dto.CertificationUrl;
        if (dto.Languages is not null) doctor.Languages = string.Join(',', dto.Languages.Select(l => l.Trim()).Where(l => l.Length > 0));

        await _db.SaveChangesAsync();
        return Ok(new { doctor.Id, doctor.Status });
    }

    [HttpPatch("{id}/reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] string newPassword)
    {
        var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        if (doctor is null) return NotFound();
        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });
        doctor.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Password updated successfully." });
    }

    [HttpPatch("{id}/verify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Verify(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        doctor.Status = DoctorStatus.Verified;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Doctor verified successfully" });
    }

    [HttpPatch("{id}/suspend")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Suspend(int id)
    {
        var doctor = await _db.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();
        doctor.Status = DoctorStatus.Inactive;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Doctor suspended" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var doctor = await _db.Doctors
            .Include(d => d.Certifications)
            .FirstOrDefaultAsync(d => d.Id == id);
        if (doctor is null) return NotFound();

        // Remove related records blocked by Restrict FK
        var appointments = _db.Appointments.Where(a => a.DoctorId == id);
        var messages = _db.Messages.Where(m => m.DoctorId == id);
        var patientAppointments = _db.PatientAppointments.Where(a => a.DoctorId == id);
        _db.Appointments.RemoveRange(appointments);
        _db.Messages.RemoveRange(messages);
        _db.PatientAppointments.RemoveRange(patientAppointments);

        _db.Doctors.Remove(doctor);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
