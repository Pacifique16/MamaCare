using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRiskLevelToTriageSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RiskLevel",
                table: "TriageSessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "TriageSessions",
                keyColumn: "Id",
                keyValue: 1,
                column: "RiskLevel",
                value: 0);

            migrationBuilder.UpdateData(
                table: "TriageSessions",
                keyColumn: "Id",
                keyValue: 2,
                column: "RiskLevel",
                value: 0);

            migrationBuilder.UpdateData(
                table: "TriageSessions",
                keyColumn: "Id",
                keyValue: 3,
                column: "RiskLevel",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 341, DateTimeKind.Utc).AddTicks(9911));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2420));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2422));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2423));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2445));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2447));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2448));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 22, 55, 56, 342, DateTimeKind.Utc).AddTicks(2449));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RiskLevel",
                table: "TriageSessions");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(5498));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8361));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8364));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8366));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8367));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8390));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8392));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8393));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 21, 20, 2, 16, 490, DateTimeKind.Utc).AddTicks(8394));
        }
    }
}
