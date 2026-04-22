using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MamaCare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddArticleViewCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "LibraryArticles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 4,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 5,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LibraryArticles",
                keyColumn: "Id",
                keyValue: 6,
                column: "ViewCount",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(5545));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8087));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8090));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8091));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8092));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8115));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8116));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8117));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 22, 1, 33, 7, 319, DateTimeKind.Utc).AddTicks(8118));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "LibraryArticles");

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
    }
}
