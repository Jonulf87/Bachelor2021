using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class OrganizerControllerTest : BaseTest
    {
        private const string _orgName1 = "Org 1";
        private const string _orgNummer1 = "1";
        private const string _decsr1 = "Org Descr 1";
        private const string _orgName2 = "Org 2";
        private const string _orgNummer2 = "2";
        private const string _decsr2 = "Org Descr 2";

        EntityEntry<ApplicationUser> _user1;
        EntityEntry<ApplicationUser> _user2;

        [Test]
        public async Task ShouldGetOrganizers()
        {
            CreateOrganizers();

            OrganizerService organizerService = new OrganizerService(_dbContext);
            OrganizerController organizerController = new OrganizerController(organizerService);

            List<OrganizerListVm> result = await organizerController.GetOrganizers();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual(_orgName1, result[0].Name);
            Assert.AreEqual(_orgNummer1, result[0].OrgNumber);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_orgName2, result[1].Name);
            Assert.AreEqual(_orgNummer2, result[1].OrgNumber);
        }

        [Test]
        public async Task ShouldGetOrganizerById()
        {
            CreateOrganizers();

            OrganizerService organizerService = new OrganizerService(_dbContext);
            OrganizerController organizerController = new OrganizerController(organizerService);

            ActionResult<OrganizerVm> result1 = await organizerController.GetOrganizer(1);
            OrganizerVm returnedOrganizer1 = result1.Value;
            Assert.AreEqual(1, returnedOrganizer1.Id);
            Assert.AreEqual(_orgName1, returnedOrganizer1.Name);
            Assert.AreEqual(_orgNummer1, returnedOrganizer1.OrgNumber);
            Assert.AreEqual(_decsr1, returnedOrganizer1.Description);
            Assert.AreEqual(_user1.Entity.Id, returnedOrganizer1.ContactId);

            ActionResult<OrganizerVm> result2 = await organizerController.GetOrganizer(2);
            OrganizerVm returnedOrganizer2 = result2.Value;
            Assert.AreEqual(2, returnedOrganizer2.Id);
            Assert.AreEqual(_orgName2, returnedOrganizer2.Name);
            Assert.AreEqual(_orgNummer2, returnedOrganizer2.OrgNumber);
            Assert.AreEqual(_decsr2, returnedOrganizer2.Description);
            Assert.AreEqual(_user2.Entity.Id, returnedOrganizer2.ContactId);
        }

        [Test]
        public async Task ShouldCreateOrganizer()
        {
            CreateOrganizers();

            string orgName = "Org 3";
            string orgNummer = "3";
            string decsr = "Org Descr 3";

            EntityEntry<ApplicationUser> user = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Test",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Testing gate 123",
                    DateOfBirth = DateTime.Now,
                    IsAllergic = false
                }
            );

            OrganizerService organizerService = new OrganizerService(_dbContext);
            OrganizerController organizerController = new OrganizerController(organizerService);

            OrganizerVm organizerVm = new OrganizerVm { Name = orgName, OrgNumber = orgNummer, Description = decsr, ContactId = user.Entity.Id };

            ActionResult<OrganizerVm> result = await organizerController.CreateOrganizer(organizerVm);

            OrganizerVm createdOrganizer = (OrganizerVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(3, createdOrganizer.Id);
            Assert.AreEqual(orgName, createdOrganizer.Name);
            Assert.AreEqual(orgNummer, createdOrganizer.OrgNumber);
            Assert.AreEqual(decsr, createdOrganizer.Description);
            Assert.AreEqual(user.Entity.Id, createdOrganizer.ContactId);

            // Check what we really have in the DB
            Organizer organizer1 = _dbContext.Organizers.Find(3);
            Assert.AreEqual(3, organizer1.Id);
            Assert.AreEqual(orgName, organizer1.Name);
            Assert.AreEqual(orgNummer, organizer1.OrgNumber);
            Assert.AreEqual(decsr, organizer1.Description);
            Assert.AreEqual(user.Entity.Id, organizer1.ContactId);
        }

        [Test]
        public async Task ShouldUpdateOrganizer()
        {
            CreateOrganizers();

            string newName = "Org 4";
            string newOrgNummer = "4";
            string decsr = "Org Descr 4";

            EntityEntry<ApplicationUser> user4 = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Test",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Testing gate 123",
                    DateOfBirth = DateTime.Now,
                    IsAllergic = false
                }
            );

            OrganizerService organizerService = new OrganizerService(_dbContext);
            OrganizerController organizerController = new OrganizerController(organizerService);

            OrganizerVm organizerVm = new OrganizerVm { Id = 1, Name = newName, OrgNumber = newOrgNummer, Description = decsr, ContactId = user4.Entity.Id };

            await organizerController.UpdateOrganizer(organizerVm);

            // Check that only one has been changed
            Organizer organizer1 = _dbContext.Organizers.Find(1);
            Assert.AreEqual(newName, organizer1.Name);
            Assert.AreEqual(newOrgNummer, organizer1.OrgNumber);
            Assert.AreEqual(decsr, organizer1.Description);
            Assert.AreEqual(user4.Entity.Id, organizer1.ContactId);


            Organizer organizer2 = _dbContext.Organizers.Find(2);
            Assert.AreEqual(_orgName2, organizer2.Name);
            Assert.AreEqual(_orgNummer2, organizer2.OrgNumber);
            Assert.AreEqual(_decsr2, organizer2.Description);
            Assert.AreEqual(_user2.Entity.Id, organizer2.ContactId);
        }

        [Test]
        public async Task ShouldDeleteMainEvent()
        {
            CreateOrganizers();

            OrganizerService organizerService = new OrganizerService(_dbContext);
            OrganizerController organizerController = new OrganizerController(organizerService);

            OrganizerVm organizertVm = new OrganizerVm
            {
                Id = 1
            };

            ActionResult<OrganizerVm> result = await organizerController.DeleteOrganizer(organizertVm);
            OrganizerVm deletedOrganizer = (OrganizerVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedOrganizer.Id);

            // Check that we have deleted only the first, but not the other
            Organizer organizer1 = _dbContext.Organizers.Find(1);
            Assert.IsNull(organizer1);
            Organizer organizer2 = _dbContext.Organizers.Find(2);
            Assert.IsNotNull(organizer2);
        }


        // Helper methods
        private void CreateOrganizers()
        {
            _user1 = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Test",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Testing gate 123",
                    DateOfBirth = DateTime.Now,
                    IsAllergic = false
                }
            );

            _user2 = _dbContext.ApplicationUsers.Add(
                new ApplicationUser
                {
                    FirstName = "Tester",
                    MiddleName = "",
                    LastName = "Testesen",
                    Address = "Testing gate 321",
                    DateOfBirth = DateTime.Now,
                    IsAllergic = false
                }
            );

            _dbContext.Organizers.Add(new Organizer { Name = _orgName1, OrgNumber = _orgNummer1, Description = _decsr1, ContactId = _user1.Entity.Id });
            _dbContext.SaveChanges();
            _dbContext.Organizers.Add(new Organizer { Name = _orgName2, OrgNumber = _orgNummer2, Description = _decsr2, ContactId = _user2.Entity.Id });
            _dbContext.SaveChanges();
        }
    }
}
