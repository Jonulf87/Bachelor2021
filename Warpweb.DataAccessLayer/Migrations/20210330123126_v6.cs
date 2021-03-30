using Microsoft.EntityFrameworkCore.Migrations;

namespace Warpweb.DataAccessLayer.Migrations
{
    public partial class v6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guardian_AspNetUsers_ApplicationUserId",
                table: "Guardian");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guardian",
                table: "Guardian");

            migrationBuilder.RenameTable(
                name: "Guardian",
                newName: "Guardians");

            migrationBuilder.RenameIndex(
                name: "IX_Guardian_ApplicationUserId",
                table: "Guardians",
                newName: "IX_Guardians_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guardians",
                table: "Guardians",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Guardians_AspNetUsers_ApplicationUserId",
                table: "Guardians",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guardians_AspNetUsers_ApplicationUserId",
                table: "Guardians");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guardians",
                table: "Guardians");

            migrationBuilder.RenameTable(
                name: "Guardians",
                newName: "Guardian");

            migrationBuilder.RenameIndex(
                name: "IX_Guardians_ApplicationUserId",
                table: "Guardian",
                newName: "IX_Guardian_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guardian",
                table: "Guardian",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Guardian_AspNetUsers_ApplicationUserId",
                table: "Guardian",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
