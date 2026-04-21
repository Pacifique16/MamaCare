using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class MergePatientIntoMother : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Mothers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BloodType",
                table: "Mothers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactName",
                table: "Mothers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactPhone",
                table: "Mothers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicalNotes",
                table: "Mothers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancellationReason",
                table: "Appointments",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CancellationReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Address", "BloodType", "EmergencyContactName", "EmergencyContactPhone", "MedicalNotes" },
                values: new object[] { null, 8, null, null, null });

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Address", "BloodType", "EmergencyContactName", "EmergencyContactPhone", "MedicalNotes" },
                values: new object[] { null, 8, null, null, null });

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Address", "BloodType", "EmergencyContactName", "EmergencyContactPhone", "MedicalNotes" },
                values: new object[] { null, 8, null, null, null });

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Address", "BloodType", "EmergencyContactName", "EmergencyContactPhone", "MedicalNotes" },
                values: new object[] { null, 8, null, null, null });

            migrationBuilder.UpdateData(
                table: "Mothers",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Address", "BloodType", "EmergencyContactName", "EmergencyContactPhone", "MedicalNotes" },
                values: new object[] { null, 8, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(3460));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6232));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6259));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6261));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6262));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6263));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6265));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6266));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 20, 16, 23, 6, 934, DateTimeKind.Utc).AddTicks(6267));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Mothers");

            migrationBuilder.DropColumn(
                name: "BloodType",
                table: "Mothers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactName",
                table: "Mothers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactPhone",
                table: "Mothers");

            migrationBuilder.DropColumn(
                name: "MedicalNotes",
                table: "Mothers");

            migrationBuilder.DropColumn(
                name: "CancellationReason",
                table: "Appointments");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(6742));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9822));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9825));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9827));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9862));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9863));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9865));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9866));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 17, 59, 31, 992, DateTimeKind.Utc).AddTicks(9868));
        }
    }
}
