using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class KinyarwandaSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Content",
                value: "Muraho Dr. Sarah, ndi kumva indwara y'umutwe ikabije kandi amaso yanjye arahumeka.");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Content",
                value: "Uwimana, nyamara ukomeze uryamye. Nakiriye ubutumwa bwawe bw'ubuvuzi. Wari wenyine?");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "Content",
                value: "Oya, umugabo wanjye ari hano. Indwara y'umutwe irushaho gukabya.");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Location",
                value: "Kigali, Rwanda");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 2,
                column: "Location",
                value: "Musanze, Rwanda");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 3,
                column: "Location",
                value: "Huye, Rwanda");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 4,
                column: "Location",
                value: "Rubavu, Rwanda");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 5,
                column: "Location",
                value: "Nyagatare, Rwanda");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(5961), "uwimana@mamacare.app", "Uwimana Clarisse", "+250 788 100 001" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8755), "mukamana@mamacare.app", "Mukamana Espérance", "+250 788 100 002" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8758), "niyonsenga@mamacare.app", "Niyonsenga Vestine", "+250 788 100 003" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8759), "uwase@mamacare.app", "Uwase Alphonsine", "+250 788 100 004" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8786), "ingabire@mamacare.app", "Ingabire Solange", "+250 788 100 005" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8787));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8788));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8790));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 15, 55, 42, 315, DateTimeKind.Utc).AddTicks(8792));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Content",
                value: "Hello Dr. Sarah, I'm feeling very dizzy and my vision is spotting.");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Content",
                value: "Aline, please remain seated. I have received your triage alert. Are you alone?");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "Content",
                value: "No, my husband is with me. The headache is getting worse.");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Location",
                value: "Seattle, WA");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 2,
                column: "Location",
                value: "Portland, OR");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 3,
                column: "Location",
                value: "Austin, TX");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 4,
                column: "Location",
                value: "Denver, CO");

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 5,
                column: "Location",
                value: "Chicago, IL");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(2157), "aline@mamacare.app", "Aline Silva", "+1 (555) 012-3456" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6463), "elena@mamacare.app", "Elena Wright", "+1 (555) 111-2222" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6469), "maya@mamacare.app", "Maya Lopez", "+1 (555) 333-4444" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6471), "sarah.p@mamacare.app", "Sarah Parker", "+1 (555) 555-6666" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Email", "FullName", "PhoneNumber" },
                values: new object[] { new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6472), "ananya@mamacare.app", "Ananya Kapoor", "+1 (555) 777-8888" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6474));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6475));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6477));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 7, 20, 9, 24, 773, DateTimeKind.Utc).AddTicks(6478));
        }
    }
}
