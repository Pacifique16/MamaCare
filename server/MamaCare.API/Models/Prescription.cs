namespace MamaCare.API.Models;

public class Prescription
{
    public int Id { get; set; }
    public int MotherId { get; set; }
    public Mother Mother { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public string MedicineName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string? Duration { get; set; }
    public string? Notes { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
}
