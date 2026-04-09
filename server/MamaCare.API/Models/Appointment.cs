namespace MamaCare.API.Models;

public enum AppointmentStatus { Scheduled, Waiting, Confirmed, Completed, Cancelled }
public enum AppointmentType { RoutineCheckup, UltrasoundScan, GlucoseScreening, BirthPlanReview, UrgentFollowUp, Postpartum }

public class Appointment
{
    public int Id { get; set; }
    public int MotherId { get; set; }
    public Mother Mother { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public DateTime ScheduledAt { get; set; }
    public AppointmentType Type { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
