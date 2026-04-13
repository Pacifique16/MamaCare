using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class EnhancePatientAppointmentsWithDoctorFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DoctorName",
                table: "PatientAppointments");

            migrationBuilder.AddColumn<int>(
                name: "DoctorId",
                table: "PatientAppointments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(2509));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4387));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4391));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4393));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4394));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4396));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4398));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4400));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 37, 50, 250, DateTimeKind.Utc).AddTicks(4402));

            migrationBuilder.CreateIndex(
                name: "IX_PatientAppointments_DoctorId",
                table: "PatientAppointments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAppointments_PatientId",
                table: "PatientAppointments",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientAppointments_Doctors_DoctorId",
                table: "PatientAppointments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientAppointments_Doctors_DoctorId",
                table: "PatientAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientAppointments_Patients_PatientId",
                table: "PatientAppointments");

            migrationBuilder.DropIndex(
                name: "IX_PatientAppointments_DoctorId",
                table: "PatientAppointments");

            migrationBuilder.DropIndex(
                name: "IX_PatientAppointments_PatientId",
                table: "PatientAppointments");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "PatientAppointments");

            migrationBuilder.AddColumn<string>(
                name: "DoctorName",
                table: "PatientAppointments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 754, DateTimeKind.Utc).AddTicks(8662));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(276));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(279));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(280));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(282));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(283));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(285));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(287));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 6, 5, 50, 755, DateTimeKind.Utc).AddTicks(288));
        }
    }
}
