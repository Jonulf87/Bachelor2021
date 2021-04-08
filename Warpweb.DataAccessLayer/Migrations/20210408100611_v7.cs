using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues");

            migrationBuilder.CreateIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues",
                column: "OrganizerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues");

            migrationBuilder.CreateIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues",
                column: "OrganizerId",
                unique: true);
        }
    }
}
