using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Services;

public class PatientAppointmentsService : IPatientAppointmentsService
{
    private readonly AppDbContext _db;

    private const int WorkdayStartHour = 8;
    private const int WorkdayEndHour = 17;
    private const int SlotMinutes = 30;

    public PatientAppointmentsService(AppDbContext db)
    {
        _db = db;
    }

    // ── Queries ──────────────────────────────────────────────────────────────

    public async Task<List<PatientAppointmentDto>> GetAllAsync()
    {
        var appointments = await _db.PatientAppointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        return appointments.Select(MapToDto).ToList();
    }

    public async Task<PatientAppointmentDto?> GetByIdAsync(int id)
    {
        var a = await _db.PatientAppointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        return a is null ? null : MapToDto(a);
    }

    public async Task<List<PatientAppointmentDto>> GetByPatientIdAsync(int patientId)
    {
        var appointments = await _db.PatientAppointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Where(a => a.PatientId == patientId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        return appointments.Select(MapToDto).ToList();
    }

    public async Task<List<DoctorOptionDto>> GetVerifiedDoctorsAsync()
    {
        return await _db.Doctors
            .Include(d => d.User)
            .Where(d => d.Status == DoctorStatus.Verified)
            .OrderBy(d => d.User.FullName)
            .Select(d => new DoctorOptionDto(d.Id, d.User.FullName, d.Specialty))
            .ToListAsync();
    }

    public async Task<List<SlotDto>> GetAvailableSlotsAsync(int doctorId, DateOnly date, int? excludeId = null)
    {
        var dayStart = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Utc);
        var dayEnd = dayStart.AddDays(1);

        // Fetch all booked times for this doctor on this date (2 queries total)
        var patientBookedQuery = _db.PatientAppointments
            .Where(a => a.DoctorId == doctorId
                     && a.AppointmentDate >= dayStart
                     && a.AppointmentDate < dayEnd
                     && a.Status != PatientAppointmentStatus.Cancelled);

        if (excludeId.HasValue)
            patientBookedQuery = patientBookedQuery.Where(a => a.Id != excludeId.Value);

        var patientBookedTimes = await patientBookedQuery
            .Select(a => a.AppointmentDate)
            .ToListAsync();

        var systemBookedTimes = await _db.Appointments
            .Where(a => a.DoctorId == doctorId
                     && a.ScheduledAt >= dayStart
                     && a.ScheduledAt < dayEnd
                     && a.Status != AppointmentStatus.Cancelled)
            .Select(a => a.ScheduledAt)
            .ToListAsync();

        var allBooked = patientBookedTimes.Concat(systemBookedTimes).ToList();

        // Build SlotMinutes-wide slots from WorkdayStartHour to WorkdayEndHour
        // e.g. 08:00–08:30, 08:30–09:00, … 16:30–17:00
        var slots = new List<SlotDto>();
        for (var h = WorkdayStartHour; h < WorkdayEndHour; h++)
        {
            foreach (var m in new[] { 0, SlotMinutes })
            {
                var slotStart = new DateTime(date.Year, date.Month, date.Day, h, m, 0, DateTimeKind.Utc);
                var slotEnd = slotStart.AddMinutes(SlotMinutes);
                var taken = allBooked.Any(t => t >= slotStart && t < slotEnd);
                slots.Add(new SlotDto($"{h:D2}:{m:D2}", !taken));
            }
        }

        return slots;
    }

    // ── Commands ─────────────────────────────────────────────────────────────

    public async Task<(PatientAppointmentDto? Result, string? Error)> CreateAsync(PatientAppointmentRequest request)
    {
        var appointmentDate = DateTime.SpecifyKind(request.AppointmentDate, DateTimeKind.Utc);

        if (await IsSlotTakenAsync(request.DoctorId, appointmentDate))
            return (null, "This time slot is already booked for the selected doctor.");

        var entity = new PatientAppointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            AppointmentDate = appointmentDate,
            Notes = request.Notes,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow,
        };

        _db.PatientAppointments.Add(entity);
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id), null);
    }

    public async Task<(PatientAppointmentDto? Result, string? Error)> UpdateAsync(int id, PatientAppointmentRequest request)
    {
        var entity = await _db.PatientAppointments.FindAsync(id);
        if (entity is null) return (null, null);

        var appointmentDate = DateTime.SpecifyKind(request.AppointmentDate, DateTimeKind.Utc);

        if (await IsSlotTakenAsync(request.DoctorId, appointmentDate, excludeId: id))
            return (null, "This time slot is already booked for the selected doctor.");

        entity.PatientId = request.PatientId;
        entity.DoctorId = request.DoctorId;
        entity.AppointmentDate = appointmentDate;
        entity.Notes = request.Notes;
        entity.Status = request.Status;

        await _db.SaveChangesAsync();

        return (await GetByIdAsync(id), null);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.PatientAppointments.FindAsync(id);
        if (entity is null) return false;

        _db.PatientAppointments.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private async Task<bool> IsSlotTakenAsync(int doctorId, DateTime appointmentDate, int? excludeId = null)
    {
        // Normalize to 30-min slot boundary (e.g. 09:15 → 09:00, 09:45 → 09:30)
        var minuteOffset = appointmentDate.Minute >= 30 ? 30 : 0;
        var slotStart = new DateTime(
            appointmentDate.Year, appointmentDate.Month, appointmentDate.Day,
            appointmentDate.Hour, minuteOffset, 0, DateTimeKind.Utc);
        var slotEnd = slotStart.AddMinutes(30);

        var patientQuery = _db.PatientAppointments
            .Where(a => a.DoctorId == doctorId
                     && a.AppointmentDate >= slotStart
                     && a.AppointmentDate < slotEnd
                     && a.Status != PatientAppointmentStatus.Cancelled);

        if (excludeId.HasValue)
            patientQuery = patientQuery.Where(a => a.Id != excludeId.Value);

        if (await patientQuery.AnyAsync()) return true;

        return await _db.Appointments
            .AnyAsync(a => a.DoctorId == doctorId
                        && a.ScheduledAt >= slotStart
                        && a.ScheduledAt < slotEnd
                        && a.Status != AppointmentStatus.Cancelled);
    }

    private static PatientAppointmentDto MapToDto(PatientAppointment a) => new()
    {
        Id = a.Id,
        PatientId = a.PatientId,
        PatientName = a.Patient.FullName,
        DoctorId = a.DoctorId,
        DoctorName = a.Doctor.User.FullName,
        DoctorSpecialty = a.Doctor.Specialty,
        AppointmentDate = a.AppointmentDate,
        Notes = a.Notes,
        Status = a.Status,
        CreatedAt = a.CreatedAt,
    };
}
