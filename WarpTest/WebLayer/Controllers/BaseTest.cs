using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Security.Claims;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.WebLayer;

namespace WarpTest.WebLayer.Controllers
{
    public class BaseTest
    {
        protected DbConnection _connection;
        protected DbContextOptions _options;
        protected ApplicationDbContext _dbContext;
        static protected ClaimsIdentity _identity1;
        protected ClaimsPrincipal _currentUser;
        protected ControllerContext _controllerContext;
        protected HttpContext _httpContext;
        protected IHttpContextAccessor _httpContextAccessor;
        protected IMainEventProvider _mainEventProvider;
        protected EntityEntry<ApplicationUser> _createdUser1;
        protected EntityEntry<ApplicationUser> _createdUser2;


        [SetUp]
        public void Setup()
        {
            CreateInMemoryDatabase();
        }

        [TearDown]
        public void TearDown()
        {
            _connection.Dispose();
        }

        protected void SetUser(ControllerBase controller, string userId)
        {
            _identity1 = new ClaimsIdentity();
            _identity1.AddClaims(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Authentication, userId)
            });
            _currentUser = new ClaimsPrincipal(_identity1);
            _controllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = _currentUser } };

            controller.ControllerContext = _controllerContext;
        }

        private void CreateInMemoryDatabase()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;

            _dbContext = new ApplicationDbContext(_options, Options.Create<OperationalStoreOptions>(new OperationalStoreOptions()), _mainEventProvider);
            _dbContext.Database.EnsureDeleted();
            _dbContext.Database.EnsureCreated();

            // Now we have nothing in _mainEventProvider
            // Let's create user first
            _createdUser1 = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Ola",
                    MiddleName = "",
                    LastName = "Testesen",
                    UserName = "OlaTestesen",
                    Address = "Oslo gate 123",
                    ZipCode = "1234",
                    Team = "Team 1",
                    DateOfBirth = DateTime.Now.AddYears(-20),
                    IsAllergic = false,
                    Gender = "Male",
                    Email = "ola@test.no",
                    PhoneNumber = "12345678"
                }
            );
            _dbContext.SaveChanges();

            // Now we need to create identity for the user
            _identity1 = new ClaimsIdentity("someAuthTypeName");
            _identity1.AddClaims(new[]
            {
                new Claim(ClaimTypes.NameIdentifier,  _createdUser1.Entity.Id),
                new Claim("CurrentMainEventId",  "1") // TODO: Always 1 for test purposes
            });
            _currentUser = new ClaimsPrincipal(_identity1);

            // Now we need to put the user into httpContext
            // Then httpContext into httpContextAccessor
            // Finally httpContextAccessor into mainEventProvider
            _httpContext = new DefaultHttpContext()
            {
                User = _currentUser
            };
            _httpContextAccessor = new HttpContextAccessor()
            {
                HttpContext = _httpContext
            };
            _mainEventProvider = new MainEventProvider(_httpContextAccessor);

            // The problem is that we don't have setter for mainEventProvider in dbContext
            // So we have to recreate dbContext with new mainEventProvider
            _dbContext = new ApplicationDbContext(_options, Options.Create<OperationalStoreOptions>(new OperationalStoreOptions()), _mainEventProvider);

            // Now we can proceed with creating test data
            _dbContext.Organizers.Add(
                new Organizer
                {
                    Name = "Organizer 1",
                    OrgNumber = "123456",
                    Description = "Description"
                    /*
                    Admins = new List<ApplicationUser>()
                    {
                        // _createdUser.Entity
                        new ApplicationUser
                        {
                            Id = _createdUser.Entity.Id
                        }
                    }
                    */
                }
            );
            _dbContext.SaveChanges();

            _dbContext.Venues.Add(
                new Venue
                {
                    Name = "Venue 1",
                    Address = "Venue gate 123",
                    PostalCode = "1236",
                    ContactPhone = "12345678",
                    ContactEMail = "venue@test.no",
                    OrganizerId = 1
                }
            );
            _dbContext.SaveChanges();

            _dbContext.MainEvents.Add(
                new MainEvent
                {
                    Name = "Event 1",
                    StartDateTime = DateTime.Now,
                    EndDateTime = DateTime.Now,
                    OrganizerId = 1,
                    VenueId = 1
                }
            );
            _dbContext.SaveChanges();

            _dbContext.Crews.Add(
                new Crew()
                {
                    Name = "Test crew 1",
                    MainEventId = 1
                }
            );
            _dbContext.SaveChanges();

            // Add existing user to the crew
            _dbContext.CrewUsers.Add(
                new CrewUser
                {
                    ApplicationUserId = _createdUser1.Entity.Id,
                    IsLeader = false,
                    CrewId = 1
                }
            );
            _dbContext.SaveChanges();

            // Create another application user to be Leader in the crew
            _createdUser2 = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Line",
                    MiddleName = "",
                    LastName = "Evensen",
                    UserName = "LineEvensen",
                    Address = "Osloveien 123",
                    ZipCode = "1234",
                    Team = "Team 1",
                    DateOfBirth = DateTime.Now.AddYears(-20),
                    IsAllergic = false,
                    Gender = "Female",
                    Email = "Line@test.no",
                    PhoneNumber = "98765432"
                }
            );
            _dbContext.SaveChanges();

            // Add
            _dbContext.CrewUsers.Add(
               new CrewUser
               {
                   ApplicationUserId = _createdUser2.Entity.Id,
                   IsLeader = true,
                   CrewId = 1
               }
           );
            _dbContext.SaveChanges();

            _dbContext.Rows.Add(
              new Row
              {
                  Name = "Test row name",
                  MainEventId = 1
              }
          );
            _dbContext.SaveChanges();

            _dbContext.Seats.Add(
              new Seat
              {
                  SeatNumber = 1,
                  RowId = 1
              }
          );
            _dbContext.SaveChanges();

            _dbContext.TicketTypes.Add(
              new TicketType
              {
                  DescriptionName = "Test ticket type",
                  BasePrice = 10,
                  AmountAvailable = 20,
                  MainEventId = 1
              }
          );
            _dbContext.SaveChanges();

            _dbContext.Tickets.Add(
              new Ticket
              {
                  Price = 15,
                  IsCheckedIn = false,
                  IsPaid = false,
                  TicketTypeId = 1,
                  MainEventId = 1,
                  ApplicationUserId = _createdUser1.Entity.Id,
                  SeatId = 1
              }
          );
            _dbContext.SaveChanges();
        }
    }
}