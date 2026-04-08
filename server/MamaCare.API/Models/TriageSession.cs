namespace MamaCare.API.Models;

public enum TriageOutcome { Normal, Monitor, Urgent, Emergency }

public class TriageSession
{
    public int Id { get; set; }
    public int MotherId { get; set; }
    public Mother Mother { get; set; } = null!;

    public string[] Symptoms { get; set; } = Array.Empty<string>();
    public int SeverityScore { get; set; }
    public string? DurationDescription { get; set; }
    public double? BloodPressureSystolic { get; set; }
    public double? BloodPressureDiastolic { get; set; }
    public double? HeartRate { get; set; }
    public double? Temperature { get; set; }
    public TriageOutcome Outcome { get; set; }
    public string? AiRecommendation { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
