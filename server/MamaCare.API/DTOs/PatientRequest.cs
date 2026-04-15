using System.ComponentModel.DataAnnotations;
using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

/// <summary>Used for both create and update patient operations.</summary>
public class PatientRequest
{
    [Required(ErrorMessage = "Full name is required.")]
    [MaxLength(200, ErrorMessage = "Full name cannot exceed 200 characters.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date of birth is required.")]
    public DateTime DateOfBirth { get; set; }

    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters.")]
    public string? PhoneNumber { get; set; }

    [MaxLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
    public string? Address { get; set; }

    [Range(0, 45, ErrorMessage = "Weeks pregnant must be between 0 and 45.")]
    public int WeeksPregnant { get; set; }

    public PatientBloodType BloodType { get; set; } = PatientBloodType.Unknown;

    public PatientRiskLevel RiskLevel { get; set; } = PatientRiskLevel.Low;

    [MaxLength(200)]
    public string? EmergencyContactName { get; set; }

    [MaxLength(20)]
    public string? EmergencyContactPhone { get; set; }

    [MaxLength(2000)]
    public string? MedicalNotes { get; set; }
}
