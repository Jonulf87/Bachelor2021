using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [TicketTypes]");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_MainEvents_MainEventId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "MainEventId",
                table: "TicketTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_MainEventId",
                table: "TicketTypes",
                column: "MainEventId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_MainEvents_MainEventId",
                table: "Tickets",
                column: "MainEventId",
                principalTable: "MainEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_MainEvents_MainEventId",
                table: "TicketTypes",
                column: "MainEventId",
                principalTable: "MainEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_MainEvents_MainEventId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_MainEvents_MainEventId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_MainEventId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "MainEventId",
                table: "TicketTypes");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketTypeId",
                table: "Tickets",
                column: "TicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_MainEvents_MainEventId",
                table: "Tickets",
                column: "MainEventId",
                principalTable: "MainEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
