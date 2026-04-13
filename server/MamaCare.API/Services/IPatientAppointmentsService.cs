using MamaCare.API.DTOs;

namespace MamaCare.API.Services;

public interface IPatientAppointmentsService
{
    Task<List<PatientAppointmentDto>> GetAllAsync();
    Task<PatientAppointmentDto?> GetByIdAsync(int id);
    Task<List<PatientAppointmentDto>> GetByPatientIdAsync(int patientId);
    Task<(PatientAppointmentDto? Result, string? Error)> CreateAsync(PatientAppointmentRequest request);
    Task<(PatientAppointmentDto? Result, string? Error)> UpdateAsync(int id, PatientAppointmentRequest request);
    Task<bool> DeleteAsync(int id);
    Task<List<DoctorOptionDto>> GetVerifiedDoctorsAsync();
    Task<List<SlotDto>> GetAvailableSlotsAsync(int doctorId, DateOnly date, int? excludeId = null);
}
