using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class FixPatientDeleteCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(6757));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9656));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9660));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9661));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9663));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9664));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9666));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9667));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 49, 43, 841, DateTimeKind.Utc).AddTicks(9669));

            migrationBuilder.AddForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(5965));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9656));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9660));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9663));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9664));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9666));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9668));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9669));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 13, 22, 11, 8, 758, DateTimeKind.Utc).AddTicks(9671));

            migrationBuilder.AddForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
