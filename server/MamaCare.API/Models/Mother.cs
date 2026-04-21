namespace MamaCare.API.Models;

public enum RiskLevel { Low, Medium, High }
public enum Trimester { First, Second, Third }
public enum BloodType { APositive, ANegative, BPositive, BNegative, OPositive, ONegative, ABPositive, ABNegative, Unknown }

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

    // Fields merged from Patient
    public BloodType BloodType { get; set; } = BloodType.Unknown;
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? MedicalNotes { get; set; }
    public string? Address { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<TriageSession> TriageSessions { get; set; } = new List<TriageSession>();
    public ICollection<VitalRecord> VitalRecords { get; set; } = new List<VitalRecord>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
