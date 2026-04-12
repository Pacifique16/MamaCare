using System.ComponentModel.DataAnnotations;

namespace MamaCare.API.DTOs;

public class PatientAppointmentRequest
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    public string? Notes { get; set; }

    public string Status { get; set; } = "Scheduled";
}
