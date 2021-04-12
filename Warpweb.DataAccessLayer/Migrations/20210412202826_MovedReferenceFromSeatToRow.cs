using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class MovedReferenceFromSeatToRow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketTypeSeats");

            migrationBuilder.DropColumn(
                name: "isBought",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "isReserved",
                table: "Seats");

            migrationBuilder.CreateTable(
                name: "TicketTypeRows",
                columns: table => new
                {
                    RowsId = table.Column<int>(type: "int", nullable: false),
                    TicketTypesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypeRows", x => new { x.RowsId, x.TicketTypesId });
                    table.ForeignKey(
                        name: "FK_TicketTypeRows_Rows_RowsId",
                        column: x => x.RowsId,
                        principalTable: "Rows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TicketTypeRows_TicketTypes_TicketTypesId",
                        column: x => x.TicketTypesId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypeRows_TicketTypesId",
                table: "TicketTypeRows",
                column: "TicketTypesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketTypeRows");

            migrationBuilder.AddColumn<bool>(
                name: "isBought",
                table: "Seats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isReserved",
                table: "Seats",
                type: "bit",
                nullable: false,
                defaultValue: false);

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
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketTypeSeats_TicketTypes_TicketTypesId",
                        column: x => x.TicketTypesId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypeSeats_TicketTypesId",
                table: "TicketTypeSeats",
                column: "TicketTypesId");
        }
    }
}
