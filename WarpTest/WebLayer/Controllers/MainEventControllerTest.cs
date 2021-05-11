using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
        private const string _eventName2 = "Test Event 2";
        private readonly DateTime _startTime2 = DateTime.Now.AddDays(7);
        private readonly DateTime _endTime2 = DateTime.Now.AddDays(9);

        private EntityEntry<ApplicationUser> _createdUser;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        [Test]
        public async Task ShouldGetMainEvents()
        {
            CreateUser();
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
            CreateUser();
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


        [Test]
        public async Task ShouldCreateMainEvent()
        {
            string name = "Test Event 3";
            DateTime startDateTime = DateTime.Now;
            DateTime endDateTime = DateTime.Now;

            MainEventService mainEventService = new MainEventService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            CreateUser();
            SetUser(mainEventController, _createdUser.Entity.Id);
            CreateOrganizers();
            CreateVenues();

            MainEventVm mainEventVm = new MainEventVm { Name = name, StartDateTime = startDateTime, EndDateTime = endDateTime, VenueId = 2, OrganizerId = 2 };

            await mainEventController.CreateMainEventAsync(mainEventVm);

            ActionResult<List<MainEventListVm>> result = await mainEventController.GetMainEventsAsync();
            List<MainEventListVm> returnedMainEvents = (List<MainEventListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(2, returnedMainEvents.Count);
            Assert.AreEqual(mainEventVm.Name, returnedMainEvents[1].Name);
            Assert.AreEqual(mainEventVm.StartDateTime, returnedMainEvents[1].StartDateTime);
            Assert.AreEqual(mainEventVm.EndDateTime, returnedMainEvents[1].EndDateTime);
        }

       
         [Test]
         public async Task ShouldUpdateMainEvent()
         {
             MainEventService mainEventService = new MainEventService(_dbContext, _userManager);
             SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
             MainEventController mainEventController = new MainEventController(mainEventService, securityService);

             CreateUser();
             SetUser(mainEventController, _createdUser.Entity.Id);
             CreateMainEvents();

             string newName = "Test name 3";
             DateTime newStartTime = DateTime.Now.AddDays(4);
             DateTime newEndTime = DateTime.Now.AddDays(8);       

             MainEventVm mainEventVm = new MainEventVm { Id = 2, Name = newName, StartDateTime = newStartTime, EndDateTime = newEndTime, VenueId = 2, OrganizerId = 2 };

             await mainEventController.UpdateMainEventAsync(mainEventVm);

             // Check that only one has been changed
             MainEvent mainEvent1 = _dbContext.MainEvents.Find(2);
             Assert.AreEqual(newName, mainEvent1.Name);
             Assert.AreEqual(newStartTime, mainEvent1.StartDateTime);
             Assert.AreEqual(newEndTime, mainEvent1.EndDateTime);
         }
            

        [Test]
         public async Task ShouldSetMainEvent()
         {
            UserStore<ApplicationUser> store = new UserStore<ApplicationUser>(_dbContext);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(store, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, null);

            MainEventService mainEventService = new MainEventService(_dbContext, userManager);
             SecurityService securityService = new SecurityService(_dbContext, userManager, _roleManager);
             MainEventController mainEventController = new MainEventController(mainEventService, securityService);

             CreateUser();
             SetUser(mainEventController, _createdUser.Entity.Id);
             CreateMainEvents();

             await mainEventController.SetCurrentEventAsync(2);

             ApplicationUser usr = _dbContext.Users.Find(_createdUser.Entity.Id);

             Assert.AreEqual(usr.CurrentMainEventId, _createdUser.Entity.CurrentMainEventId);

         }
    
        /*
        [Test]
        public async Task ShouldGetMainEvent()
        {
            MainEventService mainEventService = new MainEventService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            MainEventController mainEventController = new MainEventController(mainEventService, securityService);

            //CreateUser();
            SetUser(mainEventController, _createdUser1.Entity.Id);
            // CreateMainEvents();


            // In BaseTest we set currentMainEventId = 1
            ActionResult<CurrentMainEventVm>  result = await mainEventController.GetCurrentMainEventAsync();
            Assert.AreEqual("Event 1", result.Value.Name);
        }
        */

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
            ) ;
        }

        private void CreateOrganizers()
        {
            _dbContext.Organizers.Add(
                new Organizer
                {
                    Name = "Organizer 2",
                    OrgNumber = "654123",
                    Description = "Description",
                    
                    Admins = new List<ApplicationUser>()
                    {
                         _createdUser.Entity
                        
                    }
                    
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
            CreateOrganizers();
            CreateVenues();

            _dbContext.MainEvents.Add(
                new MainEvent
                {
                    Name = _eventName2,
                    StartDateTime = _startTime2,
                    EndDateTime = _endTime2,
                    OrganizerId = 2,
                    VenueId = 2
                }
            );
            _dbContext.SaveChanges();
        }
    }
}
