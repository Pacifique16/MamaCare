using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LibraryArticles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LibraryArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Doctors_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mothers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpectedDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GestationalWeek = table.Column<int>(type: "int", nullable: false),
                    CurrentTrimester = table.Column<int>(type: "int", nullable: false),
                    WeightKg = table.Column<double>(type: "float", nullable: false),
                    RiskLevel = table.Column<int>(type: "int", nullable: false),
                    HasGestationalDiabetes = table.Column<bool>(type: "bit", nullable: false),
                    HasHypertension = table.Column<bool>(type: "bit", nullable: false),
                    Allergies = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OnboardingComplete = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mothers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mothers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MotherId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_Mothers_MotherId",
                        column: x => x.MotherId,
                        principalTable: "Mothers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MotherId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SentByDoctor = table.Column<bool>(type: "bit", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Mothers_MotherId",
                        column: x => x.MotherId,
                        principalTable: "Mothers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TriageSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MotherId = table.Column<int>(type: "int", nullable: false),
                    Symptoms = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SeverityScore = table.Column<int>(type: "int", nullable: false),
                    DurationDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodPressureSystolic = table.Column<double>(type: "float", nullable: true),
                    BloodPressureDiastolic = table.Column<double>(type: "float", nullable: true),
                    HeartRate = table.Column<double>(type: "float", nullable: true),
                    Temperature = table.Column<double>(type: "float", nullable: true),
                    Outcome = table.Column<int>(type: "int", nullable: false),
                    AiRecommendation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TriageSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TriageSessions_Mothers_MotherId",
                        column: x => x.MotherId,
                        principalTable: "Mothers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VitalRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MotherId = table.Column<int>(type: "int", nullable: false),
                    BloodPressureSystolic = table.Column<double>(type: "float", nullable: true),
                    BloodPressureDiastolic = table.Column<double>(type: "float", nullable: true),
                    WeightKg = table.Column<double>(type: "float", nullable: true),
                    FetalHeartRate = table.Column<double>(type: "float", nullable: true),
                    Temperature = table.Column<double>(type: "float", nullable: true),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalRecords_Mothers_MotherId",
                        column: x => x.MotherId,
                        principalTable: "Mothers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "LibraryArticles",
                columns: new[] { "Id", "Category", "Content", "ImageUrl", "PublishedAt", "Status", "Summary", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, null, "https://images.unsplash.com/photo-1544126592-807daa2b569b?w=400", new DateTime(2026, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Optimizing your rest is crucial as you approach delivery.", "Safe Sleep Positions during the Third Trimester", new DateTime(2026, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 0, null, "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", new DateTime(2026, 3, 18, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Essential vitamins and nutrients for you and your baby.", "The Third Trimester Diet: What to Eat", new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, 1, null, "https://images.unsplash.com/photo-1518611012118-2969c63b07b7?w=400", new DateTime(2026, 3, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Safe exercises to keep you active during pregnancy.", "Pregnancy Safety: Gentle Movement Guide", new DateTime(2026, 3, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, 2, null, "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400", new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), 0, "Mindfulness and support strategies for new mothers.", "Managing Postpartum Anxiety", new DateTime(2026, 4, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, 0, null, "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400", new DateTime(2026, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc), 1, "What to expect and how to prepare in your first 12 weeks.", "First Trimester Essentials", new DateTime(2026, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, 4, null, "https://images.unsplash.com/photo-1518611012118-2969c63b07b7?w=400", new DateTime(2026, 3, 30, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Low-impact workouts approved for all trimesters.", "Safe Exercises for Pregnancy", new DateTime(2026, 3, 30, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "PhoneNumber", "ProfileImageUrl", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(2157), "aline@mamacare.app", "Aline Silva", "hashed_pw_1", "+1 (555) 012-3456", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", 0 },
                    { 2, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6463), "elena@mamacare.app", "Elena Wright", "hashed_pw_2", "+1 (555) 111-2222", null, 0 },
                    { 3, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6469), "maya@mamacare.app", "Maya Lopez", "hashed_pw_3", "+1 (555) 333-4444", null, 0 },
                    { 4, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6471), "sarah.p@mamacare.app", "Sarah Parker", "hashed_pw_4", "+1 (555) 555-6666", null, 0 },
                    { 5, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6472), "ananya@mamacare.app", "Ananya Kapoor", "hashed_pw_5", "+1 (555) 777-8888", null, 0 },
                    { 6, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6474), "s.mitchell@mamacare.app", "Dr. Sarah Mitchell", "hashed_pw_6", "+1 (555) 092-1111", "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", 1 },
                    { 7, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6475), "m.chen@mamacare.app", "Dr. Michael Chen", "hashed_pw_7", "+1 (555) 092-4411", "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100", 1 },
                    { 8, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6477), "e.rodriguez@mamacare.app", "Dr. Elena Rodriguez", "hashed_pw_8", "+1 (555) 092-5522", "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100", 1 },
                    { 9, new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6478), "admin@mamacare.app", "Admin Sarah", "hashed_pw_9", null, null, 2 }
                });

            migrationBuilder.InsertData(
                table: "Doctors",
                columns: new[] { "Id", "Bio", "Institution", "LicenseNumber", "Specialty", "Status", "UserId", "YearsOfExperience" },
                values: new object[,]
                {
                    { 1, "Dr. Mitchell specializes in high-risk pregnancy management with a focus on maternal wellness.", "Johns Hopkins School of Medicine", "MD-49022-OB", "Obstetrics & Gynecology", 1, 6, 12 },
                    { 2, "Dr. Chen specializes in high-risk pregnancy management and proactive postpartum care.", "Harvard Medical School", "MD-99120-X8", "Fetal Medicine Specialist", 0, 7, 14 },
                    { 3, "Dr. Rodriguez focuses on neonatal care and newborn health outcomes.", "Stanford Medical School", "MD-31002-NE", "Neonatologist", 1, 8, 9 }
                });

            migrationBuilder.InsertData(
                table: "Mothers",
                columns: new[] { "Id", "Allergies", "CurrentTrimester", "DateOfBirth", "ExpectedDueDate", "GestationalWeek", "HasGestationalDiabetes", "HasHypertension", "Location", "OnboardingComplete", "RiskLevel", "UserId", "WeightKg" },
                values: new object[,]
                {
                    { 1, "Penicillin", 2, new DateTime(1992, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 10, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 28, false, true, "Seattle, WA", true, 2, 1, 72.0 },
                    { 2, null, 1, new DateTime(1999, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 12, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 24, false, false, "Portland, OR", true, 0, 2, 70.0 },
                    { 3, null, 2, new DateTime(1993, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 31, true, true, "Austin, TX", true, 2, 3, 78.0 },
                    { 4, null, 0, new DateTime(2001, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2027, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 12, false, false, "Denver, CO", true, 1, 4, 64.0 },
                    { 5, null, 2, new DateTime(1990, 9, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 38, false, false, "Chicago, IL", true, 0, 5, 76.0 }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "CreatedAt", "DoctorId", "MotherId", "Notes", "ScheduledAt", "Status", "Type" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 1, "28-week anatomy scan", new DateTime(2026, 4, 9, 10, 30, 0, 0, DateTimeKind.Utc), 2, 1 },
                    { 2, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 1, "Urgent BP follow-up — preeclampsia risk", new DateTime(2026, 4, 7, 11, 45, 0, 0, DateTimeKind.Utc), 1, 4 },
                    { 3, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 2, "12-week routine check", new DateTime(2026, 4, 7, 9, 30, 0, 0, DateTimeKind.Utc), 1, 0 },
                    { 4, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 4, null, new DateTime(2026, 4, 7, 10, 15, 0, 0, DateTimeKind.Utc), 0, 2 },
                    { 5, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 5, null, new DateTime(2026, 4, 7, 11, 0, 0, 0, DateTimeKind.Utc), 2, 3 },
                    { 6, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 3, "GDM glucose review", new DateTime(2026, 4, 8, 8, 0, 0, 0, DateTimeKind.Utc), 0, 4 }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "DoctorId", "IsRead", "MotherId", "SentAt", "SentByDoctor" },
                values: new object[,]
                {
                    { 1, "Hello Dr. Sarah, I'm feeling very dizzy and my vision is spotting.", 1, true, 1, new DateTime(2026, 4, 7, 13, 0, 0, 0, DateTimeKind.Utc), false },
                    { 2, "Aline, please remain seated. I have received your triage alert. Are you alone?", 1, true, 1, new DateTime(2026, 4, 7, 13, 3, 0, 0, DateTimeKind.Utc), true },
                    { 3, "No, my husband is with me. The headache is getting worse.", 1, false, 1, new DateTime(2026, 4, 7, 13, 5, 0, 0, DateTimeKind.Utc), false }
                });

            migrationBuilder.InsertData(
                table: "TriageSessions",
                columns: new[] { "Id", "AiRecommendation", "BloodPressureDiastolic", "BloodPressureSystolic", "CreatedAt", "DurationDescription", "HeartRate", "MotherId", "Outcome", "SeverityScore", "Symptoms", "Temperature" },
                values: new object[,]
                {
                    { 1, "Immediate medical attention required. Symptoms consistent with preeclampsia.", 90.0, 140.0, new DateTime(2026, 4, 7, 12, 0, 0, 0, DateTimeKind.Utc), "Started 2 hours ago, worsening", 92.0, 1, 3, 9, "headache_severe,swelling_sudden,vision_blurred", 37.200000000000003 },
                    { 2, "Rest and hydration recommended. Monitor for 24 hours.", null, null, new DateTime(2026, 3, 8, 10, 0, 0, 0, DateTimeKind.Utc), "Mild, on and off for 2 days", null, 1, 1, 4, "nausea,fatigue", null },
                    { 3, "Elevated BP with symptoms. Contact your doctor today.", 95.0, 145.0, new DateTime(2026, 4, 6, 14, 0, 0, 0, DateTimeKind.Utc), "Persistent for 3 days", 88.0, 3, 2, 5, "headache_mild,fatigue", null }
                });

            migrationBuilder.InsertData(
                table: "VitalRecords",
                columns: new[] { "Id", "BloodPressureDiastolic", "BloodPressureSystolic", "FetalHeartRate", "MotherId", "Notes", "RecordedAt", "Temperature", "WeightKg" },
                values: new object[,]
                {
                    { 1, 90.0, 140.0, 142.0, 1, "Elevated BP — monitoring", new DateTime(2026, 4, 7, 12, 0, 0, 0, DateTimeKind.Utc), 37.100000000000001, 72.0 },
                    { 2, 88.0, 138.0, 145.0, 1, null, new DateTime(2026, 4, 4, 10, 0, 0, 0, DateTimeKind.Utc), null, 71.5 },
                    { 3, 72.0, 118.0, 148.0, 2, null, new DateTime(2026, 4, 6, 9, 0, 0, 0, DateTimeKind.Utc), null, 70.0 },
                    { 4, 95.0, 145.0, 138.0, 3, "High BP + glucose elevated", new DateTime(2026, 4, 6, 14, 0, 0, 0, DateTimeKind.Utc), null, 78.0 },
                    { 5, 80.0, 120.0, 140.0, 5, null, new DateTime(2026, 4, 5, 11, 0, 0, 0, DateTimeKind.Utc), null, 76.0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_MotherId",
                table: "Appointments",
                column: "MotherId");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_UserId",
                table: "Doctors",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_DoctorId",
                table: "Messages",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MotherId",
                table: "Messages",
                column: "MotherId");

            migrationBuilder.CreateIndex(
                name: "IX_Mothers_UserId",
                table: "Mothers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TriageSessions_MotherId",
                table: "TriageSessions",
                column: "MotherId");

            migrationBuilder.CreateIndex(
                name: "IX_VitalRecords_MotherId",
                table: "VitalRecords",
                column: "MotherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "LibraryArticles");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "TriageSessions");

            migrationBuilder.DropTable(
                name: "VitalRecords");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Mothers");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
