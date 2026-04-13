using System.ComponentModel.DataAnnotations;
using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public class PatientAppointmentRequest
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    public PatientAppointmentType Type { get; set; } = PatientAppointmentType.RoutineCheckup;

    public string? Notes { get; set; }

    public PatientAppointmentStatus Status { get; set; } = PatientAppointmentStatus.Scheduled;

    public string? CancellationReason { get; set; }
}
