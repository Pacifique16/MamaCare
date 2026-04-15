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

public record CertificationDto(int Id, string FileName, string Url, DateTime UploadedAt);

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
    DoctorStatus Status,
    string? CertificationUrl,
    List<CertificationDto> Certifications,
    List<string> Languages
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
    string? ProfileImageUrl,
    string? CertificationUrl
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
    string? ProfileImageUrl,
    string? CertificationUrl,
    List<string>? Languages
);

public record AddCertificationDto(string FileName, string Url);
