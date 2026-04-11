using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class FixPasswordHashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 767, DateTimeKind.Utc).AddTicks(8417), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1400), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1403), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1404), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1406), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1407), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1408), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1410), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 17, 12, 18, 768, DateTimeKind.Utc).AddTicks(1411), "$2a$11$/Sh.lP5iSGFbtdSo7wfzhetzKL8bdBd63U56bq6fYl8AIBT9jHIKW" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 876, DateTimeKind.Utc).AddTicks(8052), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(805), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(808), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(809), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(810), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(811), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(813), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(814), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 11, 14, 43, 51, 877, DateTimeKind.Utc).AddTicks(815), "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" });
        }
    }
}
