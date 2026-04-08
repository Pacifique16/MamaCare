namespace MamaCare.API.Models;

public class VitalRecord
{
    public int Id { get; set; }
    public int MotherId { get; set; }
    public Mother Mother { get; set; } = null!;

    public double? BloodPressureSystolic { get; set; }
    public double? BloodPressureDiastolic { get; set; }
    public double? WeightKg { get; set; }
    public double? FetalHeartRate { get; set; }
    public double? Temperature { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
}
