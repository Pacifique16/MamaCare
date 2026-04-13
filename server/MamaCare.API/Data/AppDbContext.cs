using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MamaCare.API.Models;

namespace MamaCare.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Mother> Mothers => Set<Mother>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<TriageSession> TriageSessions => Set<TriageSession>();
    public DbSet<VitalRecord> VitalRecords => Set<VitalRecord>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<LibraryArticle> LibraryArticles => Set<LibraryArticle>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<PatientAppointment> PatientAppointments => Set<PatientAppointment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // TriageSession: store symptoms as comma-separated string with value comparer
        modelBuilder.Entity<TriageSession>()
            .Property(t => t.Symptoms)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
            )
            .Metadata.SetValueComparer(new ValueComparer<string[]>(
                (c1, c2) => c1!.SequenceEqual(c2!),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToArray()
            ));

        // Prevent cascade delete cycles
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Mother)
            .WithMany(m => m.Appointments)
            .HasForeignKey(a => a.MotherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Mother)
            .WithMany(m => m.Messages)
            .HasForeignKey(m => m.MotherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Doctor)
            .WithMany(d => d.Messages)
            .HasForeignKey(m => m.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PatientAppointment>()
            .HasOne(a => a.Doctor)
            .WithMany()
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PatientAppointment>()
            .HasOne(a => a.Patient)
            .WithMany()
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        // Store PatientAppointmentStatus enum as its string name (no DDL migration needed)
        modelBuilder.Entity<PatientAppointment>()
            .Property(a => a.Status)
            .HasConversion<string>();

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // --- Users ---
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Uwimana Clarisse", Email = "uwimana@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Mother, PhoneNumber = "+250 788 100 001", ProfileImageUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
            new User { Id = 2, FullName = "Mukamana Espérance", Email = "mukamana@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Mother, PhoneNumber = "+250 788 100 002" },
            new User { Id = 3, FullName = "Niyonsenga Vestine", Email = "niyonsenga@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Mother, PhoneNumber = "+250 788 100 003" },
            new User { Id = 4, FullName = "Uwase Alphonsine", Email = "uwase@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Mother, PhoneNumber = "+250 788 100 004" },
            new User { Id = 5, FullName = "Ingabire Solange", Email = "ingabire@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Mother, PhoneNumber = "+250 788 100 005" },
            new User { Id = 6, FullName = "Dr. Sarah Mitchell", Email = "s.mitchell@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Doctor, PhoneNumber = "+1 (555) 092-1111", ProfileImageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100" },
            new User { Id = 7, FullName = "Dr. Michael Chen", Email = "m.chen@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Doctor, PhoneNumber = "+1 (555) 092-4411", ProfileImageUrl = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" },
            new User { Id = 8, FullName = "Dr. Elena Rodriguez", Email = "e.rodriguez@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Doctor, PhoneNumber = "+1 (555) 092-5522", ProfileImageUrl = "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100" },
            new User { Id = 9, FullName = "Admin Sarah", Email = "admin@mamacare.app", PasswordHash = "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW", Role = UserRole.Admin }
        );

        // --- Mothers ---
        modelBuilder.Entity<Mother>().HasData(
            new Mother { Id = 1, UserId = 1, DateOfBirth = new DateTime(1992, 3, 15, 0, 0, 0, DateTimeKind.Utc), Location = "Kigali, Rwanda", ExpectedDueDate = new DateTime(2026, 10, 24, 0, 0, 0, DateTimeKind.Utc), GestationalWeek = 28, CurrentTrimester = Trimester.Third, WeightKg = 72, RiskLevel = RiskLevel.High, HasHypertension = true, HasGestationalDiabetes = false, Allergies = "Penicillin", OnboardingComplete = true },
            new Mother { Id = 2, UserId = 2, DateOfBirth = new DateTime(1999, 7, 20, 0, 0, 0, DateTimeKind.Utc), Location = "Musanze, Rwanda", ExpectedDueDate = new DateTime(2026, 12, 10, 0, 0, 0, DateTimeKind.Utc), GestationalWeek = 24, CurrentTrimester = Trimester.Second, WeightKg = 70, RiskLevel = RiskLevel.Low, HasHypertension = false, HasGestationalDiabetes = false, OnboardingComplete = true },
            new Mother { Id = 3, UserId = 3, DateOfBirth = new DateTime(1993, 11, 5, 0, 0, 0, DateTimeKind.Utc), Location = "Huye, Rwanda", ExpectedDueDate = new DateTime(2026, 9, 15, 0, 0, 0, DateTimeKind.Utc), GestationalWeek = 31, CurrentTrimester = Trimester.Third, WeightKg = 78, RiskLevel = RiskLevel.High, HasHypertension = true, HasGestationalDiabetes = true, OnboardingComplete = true },
            new Mother { Id = 4, UserId = 4, DateOfBirth = new DateTime(2001, 4, 12, 0, 0, 0, DateTimeKind.Utc), Location = "Rubavu, Rwanda", ExpectedDueDate = new DateTime(2027, 2, 20, 0, 0, 0, DateTimeKind.Utc), GestationalWeek = 12, CurrentTrimester = Trimester.First, WeightKg = 64, RiskLevel = RiskLevel.Medium, HasHypertension = false, HasGestationalDiabetes = false, OnboardingComplete = true },
            new Mother { Id = 5, UserId = 5, DateOfBirth = new DateTime(1990, 9, 28, 0, 0, 0, DateTimeKind.Utc), Location = "Nyagatare, Rwanda", ExpectedDueDate = new DateTime(2026, 8, 5, 0, 0, 0, DateTimeKind.Utc), GestationalWeek = 38, CurrentTrimester = Trimester.Third, WeightKg = 76, RiskLevel = RiskLevel.Low, HasHypertension = false, HasGestationalDiabetes = false, OnboardingComplete = true }
        );

        // --- Doctors ---
        modelBuilder.Entity<Doctor>().HasData(
            new Doctor { Id = 1, UserId = 6, Specialty = "Obstetrics & Gynecology", LicenseNumber = "MD-49022-OB", Institution = "Johns Hopkins School of Medicine", YearsOfExperience = 12, Bio = "Dr. Mitchell specializes in high-risk pregnancy management with a focus on maternal wellness.", Status = DoctorStatus.Verified },
            new Doctor { Id = 2, UserId = 7, Specialty = "Fetal Medicine Specialist", LicenseNumber = "MD-99120-X8", Institution = "Harvard Medical School", YearsOfExperience = 14, Bio = "Dr. Chen specializes in high-risk pregnancy management and proactive postpartum care.", Status = DoctorStatus.Pending },
            new Doctor { Id = 3, UserId = 8, Specialty = "Neonatologist", LicenseNumber = "MD-31002-NE", Institution = "Stanford Medical School", YearsOfExperience = 9, Bio = "Dr. Rodriguez focuses on neonatal care and newborn health outcomes.", Status = DoctorStatus.Verified }
        );

        // --- Appointments ---
        modelBuilder.Entity<Appointment>().HasData(
            new Appointment { Id = 1, MotherId = 1, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 9, 10, 30, 0, DateTimeKind.Utc), Type = AppointmentType.UltrasoundScan, Status = AppointmentStatus.Confirmed, Notes = "28-week anatomy scan", CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Appointment { Id = 2, MotherId = 1, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 7, 11, 45, 0, DateTimeKind.Utc), Type = AppointmentType.UrgentFollowUp, Status = AppointmentStatus.Waiting, Notes = "Urgent BP follow-up — preeclampsia risk", CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Appointment { Id = 3, MotherId = 2, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 7, 9, 30, 0, DateTimeKind.Utc), Type = AppointmentType.RoutineCheckup, Status = AppointmentStatus.Waiting, Notes = "12-week routine check", CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Appointment { Id = 4, MotherId = 4, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 7, 10, 15, 0, DateTimeKind.Utc), Type = AppointmentType.GlucoseScreening, Status = AppointmentStatus.Scheduled, CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Appointment { Id = 5, MotherId = 5, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 7, 11, 0, 0, DateTimeKind.Utc), Type = AppointmentType.BirthPlanReview, Status = AppointmentStatus.Confirmed, CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Appointment { Id = 6, MotherId = 3, DoctorId = 1, ScheduledAt = new DateTime(2026, 4, 8, 8, 0, 0, DateTimeKind.Utc), Type = AppointmentType.UrgentFollowUp, Status = AppointmentStatus.Scheduled, Notes = "GDM glucose review", CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // --- Vital Records ---
        modelBuilder.Entity<VitalRecord>().HasData(
            new VitalRecord { Id = 1, MotherId = 1, BloodPressureSystolic = 140, BloodPressureDiastolic = 90, WeightKg = 72, FetalHeartRate = 142, Temperature = 37.1, RecordedAt = new DateTime(2026, 4, 7, 12, 0, 0, DateTimeKind.Utc), Notes = "Elevated BP — monitoring" },
            new VitalRecord { Id = 2, MotherId = 1, BloodPressureSystolic = 138, BloodPressureDiastolic = 88, WeightKg = 71.5, FetalHeartRate = 145, RecordedAt = new DateTime(2026, 4, 4, 10, 0, 0, DateTimeKind.Utc) },
            new VitalRecord { Id = 3, MotherId = 2, BloodPressureSystolic = 118, BloodPressureDiastolic = 72, WeightKg = 70, FetalHeartRate = 148, RecordedAt = new DateTime(2026, 4, 6, 9, 0, 0, DateTimeKind.Utc) },
            new VitalRecord { Id = 4, MotherId = 3, BloodPressureSystolic = 145, BloodPressureDiastolic = 95, WeightKg = 78, FetalHeartRate = 138, RecordedAt = new DateTime(2026, 4, 6, 14, 0, 0, DateTimeKind.Utc), Notes = "High BP + glucose elevated" },
            new VitalRecord { Id = 5, MotherId = 5, BloodPressureSystolic = 120, BloodPressureDiastolic = 80, WeightKg = 76, FetalHeartRate = 140, RecordedAt = new DateTime(2026, 4, 5, 11, 0, 0, DateTimeKind.Utc) }
        );

        // --- Triage Sessions ---
        modelBuilder.Entity<TriageSession>().HasData(
            new TriageSession { Id = 1, MotherId = 1, Symptoms = new[] { "headache_severe", "swelling_sudden", "vision_blurred" }, SeverityScore = 9, DurationDescription = "Started 2 hours ago, worsening", BloodPressureSystolic = 140, BloodPressureDiastolic = 90, HeartRate = 92, Temperature = 37.2, Outcome = TriageOutcome.Emergency, AiRecommendation = "Immediate medical attention required. Symptoms consistent with preeclampsia.", CreatedAt = new DateTime(2026, 4, 7, 12, 0, 0, DateTimeKind.Utc) },
            new TriageSession { Id = 2, MotherId = 1, Symptoms = new[] { "nausea", "fatigue" }, SeverityScore = 4, DurationDescription = "Mild, on and off for 2 days", Outcome = TriageOutcome.Monitor, AiRecommendation = "Rest and hydration recommended. Monitor for 24 hours.", CreatedAt = new DateTime(2026, 3, 8, 10, 0, 0, DateTimeKind.Utc) },
            new TriageSession { Id = 3, MotherId = 3, Symptoms = new[] { "headache_mild", "fatigue" }, SeverityScore = 5, DurationDescription = "Persistent for 3 days", BloodPressureSystolic = 145, BloodPressureDiastolic = 95, HeartRate = 88, Outcome = TriageOutcome.Urgent, AiRecommendation = "Elevated BP with symptoms. Contact your doctor today.", CreatedAt = new DateTime(2026, 4, 6, 14, 0, 0, DateTimeKind.Utc) }
        );

        // --- Messages ---
        modelBuilder.Entity<Message>().HasData(
            new Message { Id = 1, MotherId = 1, DoctorId = 1, Content = "Muraho Dr. Sarah, ndi kumva indwara y'umutwe ikabije kandi amaso yanjye arahumeka.", SentByDoctor = false, SentAt = new DateTime(2026, 4, 7, 13, 0, 0, DateTimeKind.Utc), IsRead = true },
            new Message { Id = 2, MotherId = 1, DoctorId = 1, Content = "Uwimana, nyamara ukomeze uryamye. Nakiriye ubutumwa bwawe bw'ubuvuzi. Wari wenyine?", SentByDoctor = true, SentAt = new DateTime(2026, 4, 7, 13, 3, 0, DateTimeKind.Utc), IsRead = true },
            new Message { Id = 3, MotherId = 1, DoctorId = 1, Content = "Oya, umugabo wanjye ari hano. Indwara y'umutwe irushaho gukabya.", SentByDoctor = false, SentAt = new DateTime(2026, 4, 7, 13, 5, 0, DateTimeKind.Utc), IsRead = false }
        );

        // --- Library Articles ---
        modelBuilder.Entity<LibraryArticle>().HasData(
            new LibraryArticle { Id = 1, Title = "Safe Sleep Positions during the Third Trimester", Summary = "Optimizing your rest is crucial as you approach delivery.", Category = ArticleCategory.Safety, Status = ArticleStatus.Published, ImageUrl = "https://images.unsplash.com/photo-1544126592-807daa2b569b?w=400", PublishedAt = new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc) },
            new LibraryArticle { Id = 2, Title = "The Third Trimester Diet: What to Eat", Summary = "Essential vitamins and nutrients for you and your baby.", Category = ArticleCategory.Nutrition, Status = ArticleStatus.Published, ImageUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", PublishedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc) },
            new LibraryArticle { Id = 3, Title = "Pregnancy Safety: Gentle Movement Guide", Summary = "Safe exercises to keep you active during pregnancy.", Category = ArticleCategory.Safety, Status = ArticleStatus.Published, ImageUrl = "https://images.unsplash.com/photo-1518611012118-2969c63b07b7?w=400", PublishedAt = new DateTime(2026, 3, 23, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 23, 0, 0, 0, DateTimeKind.Utc) },
            new LibraryArticle { Id = 4, Title = "Managing Postpartum Anxiety", Summary = "Mindfulness and support strategies for new mothers.", Category = ArticleCategory.MentalHealth, Status = ArticleStatus.Draft, ImageUrl = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400", PublishedAt = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 4, 5, 0, 0, 0, DateTimeKind.Utc) },
            new LibraryArticle { Id = 5, Title = "First Trimester Essentials", Summary = "What to expect and how to prepare in your first 12 weeks.", Category = ArticleCategory.Nutrition, Status = ArticleStatus.Published, ImageUrl = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400", PublishedAt = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc) },
            new LibraryArticle { Id = 6, Title = "Safe Exercises for Pregnancy", Summary = "Low-impact workouts approved for all trimesters.", Category = ArticleCategory.Fitness, Status = ArticleStatus.Published, ImageUrl = "https://images.unsplash.com/photo-1518611012118-2969c63b07b7?w=400", PublishedAt = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
