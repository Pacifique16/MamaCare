using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public record AppointmentDto(
    int Id,
    int MotherId,
    string MotherName,
    int DoctorId,
    string DoctorName,
    DateTime ScheduledAt,
    AppointmentType Type,
    AppointmentStatus Status,
    string? Notes,
    string? CancellationReason = null
);

public record CreateAppointmentDto(
    int MotherId,
    int DoctorId,
    DateTime ScheduledAt,
    string Type,
    string? Notes
);

public record UpdateAppointmentDto(
    DateTime? ScheduledAt,
    AppointmentType? Type,
    AppointmentStatus? Status,
    string? Notes,
    string? CancellationReason
);
