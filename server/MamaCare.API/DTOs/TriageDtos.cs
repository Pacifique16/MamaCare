using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public record TriageSessionDto(
    int Id,
    int MotherId,
    string MotherName,
    string[] Symptoms,
    int SeverityScore,
    string? DurationDescription,
    double? BloodPressureSystolic,
    double? BloodPressureDiastolic,
    double? HeartRate,
    double? Temperature,
    TriageOutcome Outcome,
    RiskLevel RiskLevel,
    string? AiRecommendation,
    DateTime CreatedAt
);

public record CreateTriageSessionDto(
    int MotherId,
    string[] Symptoms,
    int SeverityScore,
    string? DurationDescription,
    double? BloodPressureSystolic,
    double? BloodPressureDiastolic,
    double? HeartRate,
    double? Temperature
);

public record VitalRecordDto(
    int Id,
    int MotherId,
    double? BloodPressureSystolic,
    double? BloodPressureDiastolic,
    double? WeightKg,
    double? FetalHeartRate,
    double? Temperature,
    DateTime RecordedAt,
    string? Notes
);

public record CreateVitalRecordDto(
    int MotherId,
    double? BloodPressureSystolic,
    double? BloodPressureDiastolic,
    double? WeightKg,
    double? FetalHeartRate,
    double? Temperature,
    string? Notes
);
