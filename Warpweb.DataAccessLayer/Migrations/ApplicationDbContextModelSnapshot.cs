﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Warpweb.DataAccessLayer;

namespace Warpweb.DataAccessLayer.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.4")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ApplicationUserOrganizer", b =>
                {
                    b.Property<int>("AdminRoleAtOrganizersId")
                        .HasColumnType("int");

                    b.Property<string>("AdminsId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("AdminRoleAtOrganizersId", "AdminsId");

                    b.HasIndex("AdminsId");

                    b.ToTable("OrganizerAdmins");
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

            modelBuilder.Entity("SeatTicketType", b =>
                {
                    b.Property<int>("SeatsId")
                        .HasColumnType("int");

                    b.Property<int>("TicketTypesId")
                        .HasColumnType("int");

                    b.HasKey("SeatsId", "TicketTypesId");

                    b.HasIndex("TicketTypesId");

                    b.ToTable("TicketTypeSeats");
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

                    b.Property<int?>("CurrentMainEventId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("Date");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Gender")
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

                    b.Property<string>("Team")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<int?>("YearlyFee")
                        .HasColumnType("int");

                    b.Property<string>("ZipCode")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CurrentMainEventId");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Crew", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("MainEventId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("MainEventId");

                    b.ToTable("Crews");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewPermission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("CrewId")
                        .HasColumnType("int");

                    b.Property<int>("PermissionType")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CrewId");

                    b.ToTable("CrewPermissions");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ApplicationUserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CrewId")
                        .HasColumnType("int");

                    b.Property<bool>("IsLeader")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationUserId");

                    b.HasIndex("CrewId");

                    b.ToTable("CrewUsers");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Guardian", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ApplicationUserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("EMail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationUserId")
                        .IsUnique()
                        .HasFilter("[ApplicationUserId] IS NOT NULL");

                    b.ToTable("Guardians");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.MainEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AreaAvailable")
                        .HasColumnType("int");

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<DateTime>("EndDateTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDateTime")
                        .HasColumnType("datetime2");

                    b.Property<int?>("VenueId")
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

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.RefreshToken", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRevoked")
                        .HasColumnType("bit");

                    b.Property<bool>("IsUsed")
                        .HasColumnType("bit");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("RefreshTokens");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("MainEventId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("XCoordinate")
                        .HasColumnType("int");

                    b.Property<int>("YCoordinate")
                        .HasColumnType("int");

                    b.Property<bool>("isVertical")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("MainEventId");

                    b.ToTable("Rows");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("RowId")
                        .HasColumnType("int");

                    b.Property<int>("SeatNumber")
                        .HasColumnType("int");

                    b.Property<bool>("isBought")
                        .HasColumnType("bit");

                    b.Property<bool>("isReserved")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("RowId");

                    b.ToTable("Seats");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Ticket", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ApplicationUserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("MainEventId")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<int?>("SeatId")
                        .HasColumnType("int");

                    b.Property<int>("TicketTypeId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationUserId");

                    b.HasIndex("MainEventId");

                    b.HasIndex("SeatId")
                        .IsUnique()
                        .HasFilter("[SeatId] IS NOT NULL");

                    b.HasIndex("TicketTypeId");

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

                    b.Property<int>("MainEventId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MainEventId");

                    b.ToTable("TicketTypes");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Venue", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ContactEMail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ContactName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ContactPhone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizerId")
                        .HasColumnType("int");

                    b.Property<string>("PostalCode")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizerId");

                    b.ToTable("Venues");
                });

            modelBuilder.Entity("ApplicationUserOrganizer", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Organizer", null)
                        .WithMany()
                        .HasForeignKey("AdminRoleAtOrganizersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("AdminsId")
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

            modelBuilder.Entity("SeatTicketType", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Seat", null)
                        .WithMany()
                        .HasForeignKey("SeatsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.TicketType", null)
                        .WithMany()
                        .HasForeignKey("TicketTypesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.ApplicationUser", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "CurrentMainEvent")
                        .WithMany()
                        .HasForeignKey("CurrentMainEventId");

                    b.Navigation("CurrentMainEvent");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Crew", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "MainEvent")
                        .WithMany("Crews")
                        .HasForeignKey("MainEventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MainEvent");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewPermission", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Crew", "Crew")
                        .WithMany("CrewPermissions")
                        .HasForeignKey("CrewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Crew");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.CrewUser", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "ApplicationUser")
                        .WithMany("Crews")
                        .HasForeignKey("ApplicationUserId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.Crew", "Crew")
                        .WithMany("Users")
                        .HasForeignKey("CrewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ApplicationUser");

                    b.Navigation("Crew");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Guardian", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "Minor")
                        .WithOne("Guardian")
                        .HasForeignKey("Warpweb.DataAccessLayer.Models.Guardian", "ApplicationUserId");

                    b.Navigation("Minor");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.MainEvent", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Organizer", "Organizer")
                        .WithMany("MainEvent")
                        .HasForeignKey("OrganizerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.Venue", "Venue")
                        .WithMany("MainEvents")
                        .HasForeignKey("VenueId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Organizer");

                    b.Navigation("Venue");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Organizer", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "Contact")
                        .WithMany("ContactForOrganizer")
                        .HasForeignKey("ContactId");

                    b.Navigation("Contact");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.RefreshToken", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "User")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "MainEvent")
                        .WithMany("Rows")
                        .HasForeignKey("MainEventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MainEvent");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Row", "Row")
                        .WithMany("Seats")
                        .HasForeignKey("RowId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Row");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Ticket", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.ApplicationUser", "User")
                        .WithMany("Tickets")
                        .HasForeignKey("ApplicationUserId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "MainEvent")
                        .WithMany("Tickets")
                        .HasForeignKey("MainEventId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Warpweb.DataAccessLayer.Models.Seat", "Seat")
                        .WithOne("Ticket")
                        .HasForeignKey("Warpweb.DataAccessLayer.Models.Ticket", "SeatId");

                    b.HasOne("Warpweb.DataAccessLayer.Models.TicketType", "Type")
                        .WithMany("Tickets")
                        .HasForeignKey("TicketTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MainEvent");

                    b.Navigation("Seat");

                    b.Navigation("Type");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.TicketType", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.MainEvent", "MainEvent")
                        .WithMany("TicketTypes")
                        .HasForeignKey("MainEventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MainEvent");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Venue", b =>
                {
                    b.HasOne("Warpweb.DataAccessLayer.Models.Organizer", "Organizer")
                        .WithMany("Venues")
                        .HasForeignKey("OrganizerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organizer");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.ApplicationUser", b =>
                {
                    b.Navigation("ContactForOrganizer");

                    b.Navigation("Crews");

                    b.Navigation("Guardian");

                    b.Navigation("RefreshTokens");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Crew", b =>
                {
                    b.Navigation("CrewPermissions");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.MainEvent", b =>
                {
                    b.Navigation("Crews");

                    b.Navigation("Rows");

                    b.Navigation("Tickets");

                    b.Navigation("TicketTypes");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Organizer", b =>
                {
                    b.Navigation("MainEvent");

                    b.Navigation("Venues");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Row", b =>
                {
                    b.Navigation("Seats");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Seat", b =>
                {
                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.TicketType", b =>
                {
                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("Warpweb.DataAccessLayer.Models.Venue", b =>
                {
                    b.Navigation("MainEvents");
                });
#pragma warning restore 612, 618
        }
    }
}
