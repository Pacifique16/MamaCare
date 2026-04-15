using System.ComponentModel.DataAnnotations;

namespace MamaCare.API.Models;

public enum PatientBloodType { APositive, ANegative, BPositive, BNegative, OPositive, ONegative, ABPositive, ABNegative, Unknown }
public enum PatientRiskLevel { Low, Medium, High }

public class Patient
{
    public int Id { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public int WeeksPregnant { get; set; }

    public PatientBloodType BloodType { get; set; } = PatientBloodType.Unknown;

    public PatientRiskLevel RiskLevel { get; set; } = PatientRiskLevel.Low;

    public string? EmergencyContactName { get; set; }

    public string? EmergencyContactPhone { get; set; }

    public string? MedicalNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
