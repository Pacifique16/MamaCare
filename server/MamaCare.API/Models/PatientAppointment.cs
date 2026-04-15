namespace MamaCare.API.Models;

public enum PatientAppointmentStatus { Scheduled, Completed, Cancelled }

public enum PatientAppointmentType
{
    RoutineCheckup,
    UltrasoundScan,
    GlucoseScreening,
    BirthPlanReview,
    UrgentFollowUp,
    Postpartum,
    Other
}

public class PatientAppointment
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public DateTime AppointmentDate { get; set; }

    public PatientAppointmentType Type { get; set; } = PatientAppointmentType.RoutineCheckup;

    public string? Notes { get; set; }

    public PatientAppointmentStatus Status { get; set; } = PatientAppointmentStatus.Scheduled;

    public string? CancellationReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
