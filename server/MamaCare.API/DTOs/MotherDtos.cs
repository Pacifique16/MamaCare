using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public record MotherSummaryDto(
    int Id,
    string FullName,
    string? ProfileImageUrl,
    int GestationalWeek,
    Trimester Trimester,
    RiskLevel RiskLevel,
    DateTime ExpectedDueDate,
    double WeightKg,
    string? Location
);

public record MotherDetailDto(
    int Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? ProfileImageUrl,
    DateTime DateOfBirth,
    string? Location,
    DateTime ExpectedDueDate,
    int GestationalWeek,
    Trimester CurrentTrimester,
    double WeightKg,
    RiskLevel RiskLevel,
    bool HasGestationalDiabetes,
    bool HasHypertension,
    string? Allergies,
    bool OnboardingComplete
);

public record CreateMotherDto(
    string FullName,
    string Email,
    string Password,
    DateTime DateOfBirth,
    string? Location,
    DateTime ExpectedDueDate,
    int GestationalWeek,
    Trimester CurrentTrimester,
    double WeightKg,
    bool HasGestationalDiabetes,
    bool HasHypertension,
    string? Allergies
);

public record UpdateMotherDto(
    string? Location,
    DateTime? ExpectedDueDate,
    int? GestationalWeek,
    Trimester? CurrentTrimester,
    double? WeightKg,
    RiskLevel? RiskLevel,
    bool? HasGestationalDiabetes,
    bool? HasHypertension,
    string? Allergies,
    bool? OnboardingComplete
);
