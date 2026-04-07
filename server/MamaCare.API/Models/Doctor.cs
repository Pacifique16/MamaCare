namespace MamaCare.API.Models;

public enum DoctorStatus { Pending, Verified, Inactive }

public class Doctor
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Specialty { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string? Institution { get; set; }
    public int YearsOfExperience { get; set; }
    public string? Bio { get; set; }
    public DoctorStatus Status { get; set; } = DoctorStatus.Pending;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
