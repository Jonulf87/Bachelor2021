using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MainEventId",
                table: "Crews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Crews_MainEventId",
                table: "Crews",
                column: "MainEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Crews_MainEvents_MainEventId",
                table: "Crews",
                column: "MainEventId",
                principalTable: "MainEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Crews_MainEvents_MainEventId",
                table: "Crews");

            migrationBuilder.DropIndex(
                name: "IX_Crews_MainEventId",
                table: "Crews");

            migrationBuilder.DropColumn(
                name: "MainEventId",
                table: "Crews");
        }
    }
}
