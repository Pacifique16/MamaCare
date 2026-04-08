namespace MamaCare.API.Models;

public enum RiskLevel { Low, Medium, High }
public enum Trimester { First, Second, Third }

public class Mother
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }
    public string? Location { get; set; }
    public DateTime ExpectedDueDate { get; set; }
    public int GestationalWeek { get; set; }
    public Trimester CurrentTrimester { get; set; }
    public double WeightKg { get; set; }
    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
    public bool HasGestationalDiabetes { get; set; }
    public bool HasHypertension { get; set; }
    public string? Allergies { get; set; }
    public bool OnboardingComplete { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<TriageSession> TriageSessions { get; set; } = new List<TriageSession>();
    public ICollection<VitalRecord> VitalRecords { get; set; } = new List<VitalRecord>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
