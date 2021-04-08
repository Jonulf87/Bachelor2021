using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [TicketTypes]");
            migrationBuilder.Sql("UPDATE [MainEvents] SET [VenueId] = NULL");
            migrationBuilder.Sql("UPDATE [AspNetUsers] SET [VenueId] = NULL");
            migrationBuilder.Sql("DELETE FROM [Venues]");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Venues_VenueId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_CrewRoles_AspNetUsers_ApplicationUserId",
                table: "CrewRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_CrewRoles_Crews_CrewId",
                table: "CrewRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_Rows_SeatGroup_SeatGroupId",
                table: "Rows");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Seats_SeatId",
                table: "TicketTypes");

            migrationBuilder.DropTable(
                name: "SeatGroup");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_SeatId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_Rows_SeatGroupId",
                table: "Rows");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_VenueId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CrewRoles",
                table: "CrewRoles");

            migrationBuilder.DropColumn(
                name: "AreaAvailable",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "SeatId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "SeatGroupId",
                table: "Rows");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "CrewRoles",
                newName: "CrewUsers");

            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "Venues",
                newName: "OrganizerId");

            migrationBuilder.RenameIndex(
                name: "IX_CrewRoles_CrewId",
                table: "CrewUsers",
                newName: "IX_CrewUsers_CrewId");

            migrationBuilder.RenameIndex(
                name: "IX_CrewRoles_ApplicationUserId",
                table: "CrewUsers",
                newName: "IX_CrewUsers_ApplicationUserId");

            migrationBuilder.AddColumn<string>(
                name: "ContactEMail",
                table: "Venues",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Venues",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Venues",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AreaAvailable",
                table: "MainEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "MainEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CrewUsers",
                table: "CrewUsers",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TicketTypeSeats",
                columns: table => new
                {
                    SeatsId = table.Column<int>(type: "int", nullable: false),
                    TicketTypesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypeSeats", x => new { x.SeatsId, x.TicketTypesId });
                    table.ForeignKey(
                        name: "FK_TicketTypeSeats_Seats_SeatsId",
                        column: x => x.SeatsId,
                        principalTable: "Seats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TicketTypeSeats_TicketTypes_TicketTypesId",
                        column: x => x.TicketTypesId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues",
                column: "OrganizerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypeSeats_TicketTypesId",
                table: "TicketTypeSeats",
                column: "TicketTypesId");

            migrationBuilder.AddForeignKey(
                name: "FK_CrewUsers_AspNetUsers_ApplicationUserId",
                table: "CrewUsers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CrewUsers_Crews_CrewId",
                table: "CrewUsers",
                column: "CrewId",
                principalTable: "Crews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Venues_Organizers_OrganizerId",
                table: "Venues",
                column: "OrganizerId",
                principalTable: "Organizers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CrewUsers_AspNetUsers_ApplicationUserId",
                table: "CrewUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_CrewUsers_Crews_CrewId",
                table: "CrewUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Venues_Organizers_OrganizerId",
                table: "Venues");

            migrationBuilder.DropTable(
                name: "TicketTypeSeats");

            migrationBuilder.DropIndex(
                name: "IX_Venues_OrganizerId",
                table: "Venues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CrewUsers",
                table: "CrewUsers");

            migrationBuilder.DropColumn(
                name: "ContactEMail",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "AreaAvailable",
                table: "MainEvents");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "MainEvents");

            migrationBuilder.RenameTable(
                name: "CrewUsers",
                newName: "CrewRoles");

            migrationBuilder.RenameColumn(
                name: "OrganizerId",
                table: "Venues",
                newName: "Capacity");

            migrationBuilder.RenameIndex(
                name: "IX_CrewUsers_CrewId",
                table: "CrewRoles",
                newName: "IX_CrewRoles_CrewId");

            migrationBuilder.RenameIndex(
                name: "IX_CrewUsers_ApplicationUserId",
                table: "CrewRoles",
                newName: "IX_CrewRoles_ApplicationUserId");

            migrationBuilder.AddColumn<int>(
                name: "AreaAvailable",
                table: "Venues",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatId",
                table: "TicketTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SeatGroupId",
                table: "Rows",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VenueId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CrewRoles",
                table: "CrewRoles",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SeatGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VenueId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeatGroup_Venues_VenueId",
                        column: x => x.VenueId,
                        principalTable: "Venues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_SeatId",
                table: "TicketTypes",
                column: "SeatId");

            migrationBuilder.CreateIndex(
                name: "IX_Rows_SeatGroupId",
                table: "Rows",
                column: "SeatGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_VenueId",
                table: "AspNetUsers",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_SeatGroup_VenueId",
                table: "SeatGroup",
                column: "VenueId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Venues_VenueId",
                table: "AspNetUsers",
                column: "VenueId",
                principalTable: "Venues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CrewRoles_AspNetUsers_ApplicationUserId",
                table: "CrewRoles",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CrewRoles_Crews_CrewId",
                table: "CrewRoles",
                column: "CrewId",
                principalTable: "Crews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rows_SeatGroup_SeatGroupId",
                table: "Rows",
                column: "SeatGroupId",
                principalTable: "SeatGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Seats_SeatId",
                table: "TicketTypes",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
