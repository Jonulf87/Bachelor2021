using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class MainEventControllerTest : BaseTest
    {
        private const string _eventName1 = "Test Event 1";
        private readonly DateTime _startTime1 = DateTime.Now.AddDays(3);
        private readonly DateTime _endTime1 = DateTime.Now.AddDays(5);
        private const string _eventName2 = "Test Event 2";
        private readonly DateTime _startTime2 = DateTime.Now.AddDays(7);
        private readonly DateTime _endTime2 = DateTime.Now.AddDays(9);

        private EntityEntry<ApplicationUser> _createdUser;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        [Test]
        public async Task ShouldGetMainEvents()
        {
            CreateMainEvents();

            MainEventService mainEventService = new MainEventService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            ActionResult<List<MainEventListVm>> result = await mainEventController.GetMainEventsAsync();
            List<MainEventListVm> returnedMainEvents = (List<MainEventListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(2, returnedMainEvents.Count);
            Assert.AreEqual(1, returnedMainEvents[0].Id);
            Assert.AreEqual("Event 1", returnedMainEvents[0].Name);

            Assert.AreEqual(2, returnedMainEvents[1].Id);
            Assert.AreEqual(_eventName2, returnedMainEvents[1].Name);
        }

        [Test]
        public async Task ShouldGetMainEventById()
        {
            CreateMainEvents();

            // Check that we can get both by id
            MainEventService mainEventService = new MainEventService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            ActionResult<MainEventVm> result1 = await mainEventController.GetMainEventAsync(1);
            MainEventVm returnedMainEvent = (MainEventVm)((OkObjectResult)result1.Result).Value;
            Assert.AreEqual(1, returnedMainEvent.Id);
            Assert.AreEqual("Event 1", returnedMainEvent.Name);

            ActionResult<MainEventVm> result2 = await mainEventController.GetMainEventAsync(2);
            MainEventVm returnedMainEvent2 = (MainEventVm)((OkObjectResult)result2.Result).Value;
            Assert.AreEqual(2, returnedMainEvent2.Id);
            Assert.AreEqual(_eventName2, returnedMainEvent2.Name);
        }

        //[Test]
        //public async Task ShouldCreateMainEvent()
        //{
        //    string name = "Test Event 3";
        //    DateTime startTime = DateTime.Now.AddDays(4);
        //    DateTime endTime = DateTime.Now.AddDays(8);

        //    MainEventService mainEventService = new MainEventService(_dbContext);
        //    SecurityService securityService = new SecurityService(_dbContext);
        //    MainEventController mainEventController = new MainEventController(mainEventService, securityService);

        //    CreateUser();
        //    SetUser(mainEventController, _createdUser.Entity.Id);
        //    CreateOrganizers();
        //    CreateVenues();

        //    MainEventVm mainEventVm = new MainEventVm { Name = name, StartTime = startTime, EndTime = endTime, VenueId = 2, OrganizerId = 1 };

        //    ActionResult<MainEventVm> result = await mainEventController.CreateMainEvent(mainEventVm);

        //    MainEventVm createdMainEvent = (MainEventVm)((OkObjectResult)result.Result).Value;

        //    // Check object that is returned from the controller
        //    Assert.AreEqual(1, createdMainEvent.Id);
        //    Assert.AreEqual(name, createdMainEvent.Name);
        //    Assert.AreEqual(startTime, createdMainEvent.StartTime);
        //    Assert.AreEqual(endTime, createdMainEvent.EndTime);
        //    Assert.AreEqual(2, createdMainEvent.VenueId);
        //    Assert.AreEqual(1, createdMainEvent.OrganizerId);

        //    // Check what we really have in the DB
        //    MainEvent mainEvent1 = _dbContext.MainEvents.Find(1);
        //    Assert.AreEqual(1, mainEvent1.Id);
        //    Assert.AreEqual(name, mainEvent1.Name);
        //    Assert.AreEqual(startTime, mainEvent1.StartTime);
        //    Assert.AreEqual(endTime, mainEvent1.EndTime);
        //    Assert.AreEqual(2, mainEvent1.VenueId);
        //    Assert.AreEqual(1, mainEvent1.OrganizerId);

        //}

        //[Test]
        //public async Task ShouldUpdateMainEvent()
        //{
        //    CreateMainEvents();

        //    string newName = "Test name 3";
        //    DateTime newStartTime = DateTime.Now.AddDays(4);
        //    DateTime newEndTime = DateTime.Now.AddDays(8);

        //    MainEventService mainEventService = new MainEventService(_dbContext);
        //    SecurityService securityService = new SecurityService(_dbContext);

        //    MainEventController mainEventController = new MainEventController(mainEventService, securityService);

        //    MainEventVm mainEventVm = new MainEventVm { Id = 1, Name = newName, StartTime = newStartTime, EndTime = newEndTime, VenueId = 3, OrganizerId = 3 };

        //    await mainEventController.UpdateMainEvent(mainEventVm);

        //    // Check that only one has been changed
        //    MainEvent mainEvent1 = _dbContext.MainEvents.Find(1);
        //    Assert.AreEqual(newName, mainEvent1.Name);
        //    Assert.AreEqual(newStartTime, mainEvent1.StartTime);
        //    Assert.AreEqual(newEndTime, mainEvent1.EndTime);
        //    Assert.AreEqual(1, mainEvent1.VenueId);
        //    Assert.AreEqual(1, mainEvent1.OrganizerId);

        //    MainEvent mainEvent2 = _dbContext.MainEvents.Find(2);
        //    Assert.AreEqual(_eventName2, mainEvent2.Name);
        //    Assert.AreEqual(_startTime2, mainEvent2.StartTime);
        //    Assert.AreEqual(_endTime2, mainEvent2.EndTime);
        //    Assert.AreEqual(2, mainEvent2.VenueId);
        //    Assert.AreEqual(2, mainEvent2.OrganizerId);
        //}

        //[Test]
        //public async Task ShouldDeleteMainEvent()
        //{
        //    CreateMainEvents();

        //    MainEventService mainEventService = new MainEventService(_dbContext);
        //    SecurityService securityService = new SecurityService(_dbContext);

        //    MainEventController mainEventController = new MainEventController(mainEventService, securityService);

        //    MainEventVm mainEventVm = new MainEventVm
        //    {
        //        Id = 1
        //    };

        //    ActionResult<MainEventVm> result = await mainEventController.DeleteMainEvent(mainEventVm);
        //    MainEventVm deletedMainEvent = (MainEventVm)((OkObjectResult)result.Result).Value;

        //    Assert.AreEqual(1, deletedMainEvent.Id);

        //    // Check that we have deleted only the first, but not the other
        //    MainEvent mainEvent1 = _dbContext.MainEvents.Find(1);
        //    Assert.IsNull(mainEvent1);
        //    MainEvent mainEvent2 = _dbContext.MainEvents.Find(2);
        //    Assert.IsNotNull(mainEvent2);
        //}

        // Helper methods
        private void CreateUser()
        {
            _createdUser = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Test",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Testing gate 123",
                    DateOfBirth = DateTime.Now.AddYears(-20),
                    IsAllergic = false,
                    Gender = "Female",
                    Email = "test@test.no",
                    PhoneNumber = "98765433"
                }
            );
        }

        private void CreateOrganizers()
        {
            _dbContext.Organizers.Add(
                new Organizer
                {
                    Name = "Organizer 2",
                    OrgNumber = "654123",
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
        }

        private void CreateVenues()
        {
            _dbContext.Venues.Add(
                new Venue
                {
                    Name = "Venue 2",
                    Address = "Venue gate 321",
                    PostalCode = "1246",
                    ContactPhone = "12345987",
                    ContactEMail = "venue2@test.no",
                    OrganizerId = 1
                }
            );
            _dbContext.SaveChanges();
        }

        private void CreateMainEvents()
        {
        CreateUser();
        CreateOrganizers();
        CreateVenues();

            _dbContext.MainEvents.Add(
                    new MainEvent
                    {
                        Name = _eventName2,
                        StartDateTime = DateTime.Now,
                        EndDateTime = DateTime.Now,
                        OrganizerId = 2,
                        VenueId = 2
                    }
                );
            _dbContext.SaveChanges();
        }
    }
}
