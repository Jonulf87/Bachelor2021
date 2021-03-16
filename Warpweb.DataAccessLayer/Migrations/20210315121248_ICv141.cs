using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class ICv141 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Venues_MainEventId",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "MainEvents");

            migrationBuilder.RenameColumn(
                name: "VenueName",
                table: "Venues",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "VenueCapacity",
                table: "Venues",
                newName: "Capacity");

            migrationBuilder.RenameColumn(
                name: "VenueAreaAvailable",
                table: "Venues",
                newName: "AreaAvailable");

            migrationBuilder.RenameColumn(
                name: "VenueAddress",
                table: "Venues",
                newName: "Address");

            migrationBuilder.RenameColumn(
                name: "VenueId",
                table: "Venues",
                newName: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Venues_MainEventId",
                table: "Venues",
                column: "MainEventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Venues_MainEventId",
                table: "Venues");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Venues",
                newName: "VenueName");

            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "Venues",
                newName: "VenueCapacity");

            migrationBuilder.RenameColumn(
                name: "AreaAvailable",
                table: "Venues",
                newName: "VenueAreaAvailable");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Venues",
                newName: "VenueAddress");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Venues",
                newName: "VenueId");

            migrationBuilder.AddColumn<int>(
                name: "VenueId",
                table: "MainEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Venues_MainEventId",
                table: "Venues",
                column: "MainEventId",
                unique: true);
        }
    }
}
