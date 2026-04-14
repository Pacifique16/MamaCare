using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public record DoctorSummaryDto(
    int Id,
    string FullName,
    string? ProfileImageUrl,
    string Specialty,
    string LicenseNumber,
    DoctorStatus Status,
    string? LastActive
);

public record DoctorDetailDto(
    int Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? ProfileImageUrl,
    string Specialty,
    string LicenseNumber,
    string? Institution,
    int YearsOfExperience,
    string? Bio,
    DoctorStatus Status
);

public record CreateDoctorDto(
    string FullName,
    string Email,
    string Password,
    string? PhoneNumber,
    string Specialty,
    string LicenseNumber,
    string? Institution,
    int YearsOfExperience,
    string? Bio,
    string? ProfileImageUrl
);

public record UpdateDoctorDto(
    string? FullName,
    string? PhoneNumber,
    string? Specialty,
    string? LicenseNumber,
    string? Institution,
    int? YearsOfExperience,
    string? Bio,
    string? Status,
    string? ProfileImageUrl
);
