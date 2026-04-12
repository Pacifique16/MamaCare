namespace MamaCare.API.Models;

public class PatientAppointment
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public DateTime AppointmentDate { get; set; }

    public string? Notes { get; set; }

    /// <summary>Allowed values: Scheduled, Completed, Cancelled</summary>
    public string Status { get; set; } = "Scheduled";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
