using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorLanguages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Doctors",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "Languages",
                value: null);

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "Languages",
                value: null);

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "Languages",
                value: null);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Doctors");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(2482));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5666));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5669));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5671));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5672));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5673));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5675));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5676));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 14, 14, 43, 9, 421, DateTimeKind.Utc).AddTicks(5678));
        }
    }
}
