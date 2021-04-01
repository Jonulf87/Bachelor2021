using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Row_SeatGroup_SeatGroupId",
                table: "Row");

            migrationBuilder.DropForeignKey(
                name: "FK_Seat_Row_RowId",
                table: "Seat");

            migrationBuilder.DropForeignKey(
                name: "FK_Seat_Tickets_TicketId",
                table: "Seat");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Seat_SeatId",
                table: "TicketTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Seat",
                table: "Seat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Row",
                table: "Row");

            migrationBuilder.RenameTable(
                name: "Seat",
                newName: "Seats");

            migrationBuilder.RenameTable(
                name: "Row",
                newName: "Rows");

            migrationBuilder.RenameIndex(
                name: "IX_Seat_TicketId",
                table: "Seats",
                newName: "IX_Seats_TicketId");

            migrationBuilder.RenameIndex(
                name: "IX_Seat_RowId",
                table: "Seats",
                newName: "IX_Seats_RowId");

            migrationBuilder.RenameColumn(
                name: "Rotation",
                table: "Rows",
                newName: "Name");

            migrationBuilder.RenameIndex(
                name: "IX_Row_SeatGroupId",
                table: "Rows",
                newName: "IX_Rows_SeatGroupId");

            migrationBuilder.AlterColumn<int>(
                name: "RowId",
                table: "Seats",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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

            migrationBuilder.AlterColumn<int>(
                name: "YCoordinate",
                table: "Rows",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "XCoordinate",
                table: "Rows",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MainEventId",
                table: "Rows",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "isVertical",
                table: "Rows",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Seats",
                table: "Seats",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rows",
                table: "Rows",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Rows_MainEventId",
                table: "Rows",
                column: "MainEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rows_MainEvents_MainEventId",
                table: "Rows",
                column: "MainEventId",
                principalTable: "MainEvents",
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
                name: "FK_Seats_Rows_RowId",
                table: "Seats",
                column: "RowId",
                principalTable: "Rows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Tickets_TicketId",
                table: "Seats",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Seats_SeatId",
                table: "TicketTypes",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rows_MainEvents_MainEventId",
                table: "Rows");

            migrationBuilder.DropForeignKey(
                name: "FK_Rows_SeatGroup_SeatGroupId",
                table: "Rows");

            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Rows_RowId",
                table: "Seats");

            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Tickets_TicketId",
                table: "Seats");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Seats_SeatId",
                table: "TicketTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Seats",
                table: "Seats");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rows",
                table: "Rows");

            migrationBuilder.DropIndex(
                name: "IX_Rows_MainEventId",
                table: "Rows");

            migrationBuilder.DropColumn(
                name: "isBought",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "isReserved",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "MainEventId",
                table: "Rows");

            migrationBuilder.DropColumn(
                name: "isVertical",
                table: "Rows");

            migrationBuilder.RenameTable(
                name: "Seats",
                newName: "Seat");

            migrationBuilder.RenameTable(
                name: "Rows",
                newName: "Row");

            migrationBuilder.RenameIndex(
                name: "IX_Seats_TicketId",
                table: "Seat",
                newName: "IX_Seat_TicketId");

            migrationBuilder.RenameIndex(
                name: "IX_Seats_RowId",
                table: "Seat",
                newName: "IX_Seat_RowId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Row",
                newName: "Rotation");

            migrationBuilder.RenameIndex(
                name: "IX_Rows_SeatGroupId",
                table: "Row",
                newName: "IX_Row_SeatGroupId");

            migrationBuilder.AlterColumn<int>(
                name: "RowId",
                table: "Seat",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "YCoordinate",
                table: "Row",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "XCoordinate",
                table: "Row",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Seat",
                table: "Seat",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Row",
                table: "Row",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Row_SeatGroup_SeatGroupId",
                table: "Row",
                column: "SeatGroupId",
                principalTable: "SeatGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Seat_Row_RowId",
                table: "Seat",
                column: "RowId",
                principalTable: "Row",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Seat_Tickets_TicketId",
                table: "Seat",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Seat_SeatId",
                table: "TicketTypes",
                column: "SeatId",
                principalTable: "Seat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
