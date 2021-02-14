using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
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

        [Test]
        public async Task ShouldGetMainEvents()
        {
            CreateMainEvents();

            // Check
            MainEventService mainEventService = new MainEventService(_dbContext);
            SecurityService securityService = new SecurityService(_dbContext);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            List<MainEventListVm> result = await mainEventController.GetMainEvents();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual(_eventName1, result[0].Name);
            Assert.AreEqual(_startTime1, result[0].StartTime);
            Assert.AreEqual(_endTime1, result[0].EndTime);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_eventName2, result[1].Name);
            Assert.AreEqual(_startTime2, result[1].StartTime);
            Assert.AreEqual(_endTime2, result[1].EndTime);
        }

        [Test]
        public async Task ShouldGetMainEventById()
        {
            CreateMainEvents();

            // Check that we can get both by id
            MainEventService mainEventService = new MainEventService(_dbContext);
            SecurityService securityService = new SecurityService(_dbContext);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            ActionResult<MainEventVm> result1 = await mainEventController.GetMainEvent(1);
            MainEventVm returnedMainEvent = result1.Value;
            Assert.AreEqual(1, returnedMainEvent.Id);
            Assert.AreEqual(_eventName1, returnedMainEvent.Name);
            Assert.AreEqual(_startTime1, returnedMainEvent.StartTime);
            Assert.AreEqual(_endTime1, returnedMainEvent.EndTime);

            ActionResult<MainEventVm> result2 = await mainEventController.GetMainEvent(2);
            MainEventVm returnedMainEvent2 = result2.Value;
            Assert.AreEqual(2, returnedMainEvent2.Id);
            Assert.AreEqual(_eventName2, returnedMainEvent2.Name);
            Assert.AreEqual(_startTime2, returnedMainEvent2.StartTime);
            Assert.AreEqual(_endTime2, returnedMainEvent2.EndTime);
        }

        [Test]
        public async Task ShouldCreateMainEvent()
        {
            string name = "Test name 3";
            DateTime startTime = DateTime.Now.AddDays(4);
            DateTime endTime = DateTime.Now.AddDays(8);

            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[] {
                        new Claim(ClaimTypes.NameIdentifier, "Org 1")
                    },
                    "TestAuthentication"
                )
            );

            MainEventService mainEventService = new MainEventService(_dbContext);
            SecurityService securityService = new SecurityService(_dbContext);
            MainEventController mainEventController = new MainEventController(mainEventService, securityService);
            mainEventController.ControllerContext = new ControllerContext();
            mainEventController.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            MainEventVm mainEventVm = new MainEventVm { Name = name, StartTime = startTime, EndTime = endTime, VenueId = 2, OrganizerId = 1 };

            ActionResult<MainEventVm> result = await mainEventController.CreateMainEvent(mainEventVm);

            MainEventVm createdMainEvent = (MainEventVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(3, createdMainEvent.Id);
            Assert.AreEqual(name, createdMainEvent.Name);
            Assert.AreEqual(startTime, createdMainEvent.StartTime);
            Assert.AreEqual(endTime, createdMainEvent.EndTime);
            Assert.AreEqual(2, createdMainEvent.VenueId);
            Assert.AreEqual(1, createdMainEvent.OrganizerId);

            // Check what we really have in the DB
            MainEvent mainEvent1 = _dbContext.MainEvents.Find(3);
            Assert.AreEqual(3, mainEvent1.Id);
            Assert.AreEqual(name, mainEvent1.Name);
            Assert.AreEqual(startTime, mainEvent1.StartTime);
            Assert.AreEqual(endTime, mainEvent1.EndTime);
            Assert.AreEqual(2, mainEvent1.VenueId);
            Assert.AreEqual(1, mainEvent1.OrganizerId);

        }

        [Test]
        public async Task ShouldUpdateMainEvent()
        {
            CreateMainEvents();

            string newName = "Test name 3";
            DateTime newStartTime = DateTime.Now.AddDays(4);
            DateTime newEndTime = DateTime.Now.AddDays(8);

            MainEventService mainEventService = new MainEventService(_dbContext);
            SecurityService securityService = new SecurityService(_dbContext);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            MainEventVm mainEventVm = new MainEventVm { Id = 1, Name = newName, StartTime = newStartTime, EndTime = newEndTime, VenueId = 3, OrganizerId = 3 };

            await mainEventController.UpdateMainEvent(mainEventVm);

            // Check that only one has been changed
            MainEvent mainEvent1 = _dbContext.MainEvents.Find(1);
            Assert.AreEqual(newName, mainEvent1.Name);
            Assert.AreEqual(newStartTime, mainEvent1.StartTime);
            Assert.AreEqual(newEndTime, mainEvent1.EndTime);
            Assert.AreEqual(1, mainEvent1.VenueId);
            Assert.AreEqual(1, mainEvent1.OrganizerId);

            MainEvent mainEvent2 = _dbContext.MainEvents.Find(2);
            Assert.AreEqual(_eventName2, mainEvent2.Name);
            Assert.AreEqual(_startTime2, mainEvent2.StartTime);
            Assert.AreEqual(_endTime2, mainEvent2.EndTime);
            Assert.AreEqual(2, mainEvent2.VenueId);
            Assert.AreEqual(2, mainEvent2.OrganizerId);
        }

        [Test]
        public async Task ShouldDeleteMainEvent()
        {
            CreateMainEvents();

            MainEventService mainEventService = new MainEventService(_dbContext);
            SecurityService securityService = new SecurityService(_dbContext);

            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            MainEventVm mainEventVm = new MainEventVm
            {
                Id = 1
            };

            ActionResult<MainEventVm> result = await mainEventController.DeleteMainEvent(mainEventVm);
            MainEventVm deletedMainEvent = (MainEventVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedMainEvent.Id);

            // Check that we have deleted only the first, but not the other
            MainEvent mainEvent1 = _dbContext.MainEvents.Find(1);
            Assert.IsNull(mainEvent1);
            MainEvent mainEvent2 = _dbContext.MainEvents.Find(2);
            Assert.IsNotNull(mainEvent2);
        }

        // Helper methods
        private void CreateMainEvents()
        {
            // Create 2 main events with necessary linked data
            _dbContext.Venues.Add(new Venue { VenueName = "Venue Name 1", VenueAddress = "Venueveien 1", VenueAreaAvailable = 1, VenueCapacity = 1 });
            _dbContext.Venues.Add(new Venue { VenueName = "Venue Name 2", VenueAddress = "Venueveien 2", VenueAreaAvailable = 2, VenueCapacity = 2 });

            EntityEntry<ApplicationUser> user = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Test",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Blabla gate 123",
                    DateOfBirth = DateTime.Now,
                    IsAllergic = false
                }
            );

            _dbContext.Organizers.Add(new Organizer { Name = "Org 1", OrgNumber = "1", Description = "Org Descr 1", ContactId = user.Entity.Id });
            _dbContext.Organizers.Add(new Organizer { Name = "Org 2", OrgNumber = "2", Description = "Org Descr 2", ContactId = user.Entity.Id });

            _dbContext.SaveChanges();

            _dbContext.MainEvents.Add(new MainEvent { Name = _eventName1, StartTime = _startTime1, EndTime = _endTime1, VenueId = 1, OrganizerId = 1 });
            _dbContext.SaveChanges();
            _dbContext.MainEvents.Add(new MainEvent { Name = _eventName2, StartTime = _startTime2, EndTime = _endTime2, VenueId = 2, OrganizerId = 2 });
            _dbContext.SaveChanges();
        }
    }
}
