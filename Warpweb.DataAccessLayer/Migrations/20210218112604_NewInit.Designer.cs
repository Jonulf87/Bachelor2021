﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Warpweb.DataAccessLayer;

namespace Warpweb.DataAccessLayer.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210218112604_NewInit")]
    partial class NewInit
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ApplicationUserApplicationUser", b =>
                {
                    b.Property<string>("GuardianId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("MinorId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("GuardianId", "MinorId");

                    b.HasIndex("MinorId");

                    b.ToTable("ApplicationUserApplicationUser");
                });

            modelBuilder.Entity("CrewCrewRole", b =>
                {
                    b.Property<int>("CrewRolesCrewRoleId")
                        .HasColumnType("int");

                    b.Property<int>("CrewsCrewId")
                        .HasColumnType("int");

                    b.HasKey("CrewRolesCrewRoleId", "CrewsCrewId");

                    b.HasIndex("CrewsCrewId");

                    b.ToTable("CrewCrewRole");
                });

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.DeviceFlowCodes", b =>
                {
                    b.Property<string>("UserCode")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasMaxLength(50000)
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("DeviceCode")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("Expiration")
                        .IsRequired()
                        .HasColumnType("datetime2");

                    b.Property<string>("SessionId")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("SubjectId")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.HasKey("UserCode");

                    b.HasIndex("DeviceCode")
                        .IsUnique();

                    b.HasIndex("Expiration");

                    b.ToTable("DeviceCodes");
                });

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.PersistedGrant", b =>
                {
                    b.Property<string>("Key")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("ConsumedTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasMaxLength(50000)
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("Expiration")
                        .HasColumnType("datetime2");

                    b.Property<string>("SessionId")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("SubjectId")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Key");

                    b.HasIndex("Expiration");

                    b.HasIndex("SubjectId", "ClientId", "Type");

                    b.HasIndex("SubjectId", "SessionId", "Type");

                    b.ToTable("PersistedGrants");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AllergyDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Comments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("Date");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAllergic")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("MiddleName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<int?>("VenueId")
                        .HasColumnType("int");

                    b.Property<int?>("YearlyFee")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("VenueId");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Crew", b =>
                {
                    b.Property<int>("CrewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CrewName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CrewId");

                    b.ToTable("Crews");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewRole", b =>
                {
                    b.Property<int>("CrewRoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ApplicationUserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CrewRoleId");

                    b.HasIndex("ApplicationUserId");

                    b.ToTable("CrewRoles");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.MainEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("VenueId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OrganizerId");

                    b.HasIndex("VenueId");

                    b.ToTable("MainEvents");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Organizer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ContactId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OrgNumber")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ContactId");

                    b.ToTable("Organizers");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Rotation")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("SeatGroupId")
                        .HasColumnType("int");

                    b.Property<string>("XCoordinate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("YCoordinate")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("SeatGroupId");

                    b.ToTable("Row");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("RowId")
                        .HasColumnType("int");

                    b.Property<string>("SeatNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TicketId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RowId");

                    b.HasIndex("TicketId");

                    b.ToTable("Seat");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.SeatGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("VenueId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("VenueId");

                    b.ToTable("SeatGroup");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Ticket", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("MainEventId")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<string>("Seat")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("TicketTypeId")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("MainEventId");

                    b.HasIndex("TicketTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.TicketType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AmountAvailable")
                        .HasColumnType("int");

                    b.Property<int>("BasePrice")
                        .HasColumnType("int");

                    b.Property<string>("DescriptionName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("SeatId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("SeatId");

                    b.ToTable("TicketTypes");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Venue", b =>
                {
                    b.Property<int>("VenueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("VenueAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VenueAreaAvailable")
                        .HasColumnType("int");

                    b.Property<int>("VenueCapacity")
                        .HasColumnType("int");

                    b.Property<string>("VenueName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("VenueId");

                    b.ToTable("Venues");
                });

            modelBuilder.Entity("ApplicationUserApplicationUser", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("GuardianId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("MinorId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CrewCrewRole", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.CrewRole", null)
                        .WithMany()
                        .HasForeignKey("CrewRolesCrewRoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.Crew", null)
                        .WithMany()
                        .HasForeignKey("CrewsCrewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.ApplicationUser", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Venue", null)
                        .WithMany("Users")
                        .HasForeignKey("VenueId");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewRole", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "ApplicationUser")
                        .WithMany("CrewRoles")
                        .HasForeignKey("ApplicationUserId");

                    b.Navigation("ApplicationUser");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.MainEvent", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Organizer", "Organizer")
                        .WithMany("MainEvent")
                        .HasForeignKey("OrganizerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.Venue", "Venue")
                        .WithMany()
                        .HasForeignKey("VenueId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organizer");

                    b.Navigation("Venue");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Organizer", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "Contact")
                        .WithMany()
                        .HasForeignKey("ContactId");

                    b.Navigation("Contact");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.SeatGroup", null)
                        .WithMany("Rows")
                        .HasForeignKey("SeatGroupId");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Row", null)
                        .WithMany("Seats")
                        .HasForeignKey("RowId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.Ticket", "Ticket")
                        .WithMany()
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.SeatGroup", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Venue", null)
                        .WithMany("SeatGroups")
                        .HasForeignKey("VenueId");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Ticket", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "MainEvent")
                        .WithMany()
                        .HasForeignKey("MainEventId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.TicketType", "TicketType")
                        .WithMany()
                        .HasForeignKey("TicketTypeId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "User")
                        .WithMany("Tickets")
                        .HasForeignKey("UserId");

                    b.Navigation("MainEvent");

                    b.Navigation("TicketType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.TicketType", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Seat", null)
                        .WithMany("TicketTypes")
                        .HasForeignKey("SeatId");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.ApplicationUser", b =>
                {
                    b.Navigation("CrewRoles");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Organizer", b =>
                {
                    b.Navigation("MainEvent");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.Navigation("Seats");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.Navigation("TicketTypes");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.SeatGroup", b =>
                {
                    b.Navigation("Rows");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Venue", b =>
                {
                    b.Navigation("SeatGroups");

                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}