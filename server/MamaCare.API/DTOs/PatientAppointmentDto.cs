using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public class PatientAppointmentDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorSpecialty { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string? Notes { get; set; }
    public PatientAppointmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
