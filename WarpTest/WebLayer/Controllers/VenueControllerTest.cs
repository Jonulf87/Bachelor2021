using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class VenueControllerTest : BaseTest
    {
        private EntityEntry<ApplicationUser> _createdUser;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        private const string _venueName2 = "Venue 2";
        private const string _venueAddress2 = "Testing gate 214";
        private const string _postalCode2 = "0255";
        private const string _contactPhone2 = "58996652";
        private const string _contactEMail2 = "venue2@test.no";


        [Test]
        public async Task ShouldGetVenues()
        {
            CreateVenues();
            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);           
            VenueController venueController = new VenueController(venueService, securityService);

            List<VenueListVm> result = await venueController.GetVenuesAsync();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual("Venue 1", result[0].Name);
            Assert.AreEqual("Venue gate 123", result[0].Address);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_venueName2, result[1].Name);
            Assert.AreEqual(_venueAddress2, result[1].Address);
        }

        [Test]
        public async Task ShouldGetOrganizerVenues()
        {
            CreateVenues();
            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            VenueController venueController = new VenueController(venueService, securityService);

            List<VenueListVm> result = await venueController.GetOrganizerVenuesAsync();

            Assert.AreEqual(1, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual("Venue 1", result[0].Name);
        }

        [Test]
        public async Task ShouldGetVenueById()
        {
            CreateVenues();

            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            VenueController venueController = new VenueController(venueService, securityService);

            ActionResult<VenueVm> result1 = await venueController.GetVenueAsync(1);

            VenueVm returnedVenue1 = result1.Value;
            Assert.AreEqual(1, returnedVenue1.Id);
            Assert.AreEqual("Venue 1", returnedVenue1.Name);
            Assert.AreEqual("Venue gate 123", returnedVenue1.Address);
            Assert.AreEqual("1236", returnedVenue1.PostalCode);
            Assert.AreEqual("12345678", returnedVenue1.ContactPhone);
            Assert.AreEqual("venue@test.no", returnedVenue1.ContactEMail);

            ActionResult<VenueVm> result2 = await venueController.GetVenueAsync(2);

            VenueVm returnedVenue2 = result2.Value;
            Assert.AreEqual(2, returnedVenue2.Id);
            Assert.AreEqual(_venueName2, returnedVenue2.Name);
            Assert.AreEqual(_venueAddress2, returnedVenue2.Address);
            Assert.AreEqual(_postalCode2, returnedVenue2.PostalCode);
            Assert.AreEqual(_contactPhone2, returnedVenue2.ContactPhone);
            Assert.AreEqual(_contactEMail2, returnedVenue2.ContactEMail);
        }

        [Test]
        public void ShouldNotGetVenueWithInvalidId()
        {
            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            VenueController venueController = new VenueController(venueService, securityService);

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<VenueVm> result = await venueController.GetVenueAsync(-1);
            });
            Assert.AreEqual("Ugyldig Id", ex.Message);
        }



        [Test]
        public async Task ShouldCreateVenue()
        {
           
            string venueName3 = "Venue name 3";
            string venueAddress3 = "Testing gate 215";


            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            VenueController venueController = new VenueController(venueService, securityService);

            CreateUser();
            CreateVenues();
            SetUser(venueController, _createdUser2.Entity.Id);
            

            VenueVm venueVm = new VenueVm { Name = venueName3, Address = venueAddress3, PostalCode = "0258", ContactEMail = "venue3@test.no", ContactPhone = "1234578", OrganizerId = 2};

            await venueController.CreateVenueAsync(venueVm);

            List<VenueListVm> venues = await venueController.GetVenuesAsync();
            Venue createdVenue = _dbContext.Venues.Find(3);

            Assert.AreEqual(3, venues.Count);
            Assert.That(venues, Has.Exactly(1).Matches<VenueListVm>(venue => venue.Id == createdVenue.Id &&
                                                                           venue.Name == createdVenue.Name &&
                                                                           venue.Address == createdVenue.Address
                                                                           ));
        }

        [Test]
        public async Task ShouldUpdateVenue()
        {
            string newVenueName = "Venue name ";
            string newVenueAddress = "Testing gate 216";

            VenueService venueService = new VenueService(_dbContext, _mainEventProvider);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            VenueController venueController = new VenueController(venueService, securityService);

            CreateUser();
            CreateVenues();
            SetUser(venueController, _createdUser.Entity.Id);

            VenueVm venueVm = new VenueVm { Id = 2, Name = newVenueName, Address = newVenueAddress, PostalCode = _postalCode2, ContactEMail = _contactEMail2, ContactPhone = _contactPhone2, OrganizerId = 2};

            await venueController.UpdateVenueAsync(venueVm);

            // Check that only one has been changed
            Venue venue2 = _dbContext.Venues.Find(2);
            Assert.AreEqual(newVenueName, venue2.Name);
            Assert.AreEqual(newVenueAddress, venue2.Address);          
        }


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
        private void CreateVenues()
        {
            _dbContext.Organizers.Add(
                 new Organizer
                 {
                     Name = "Organizer 2",
                     OrgNumber = "1234567",
                     Description = "Description",

                     Admins = new List<ApplicationUser>()
                     {
                        _createdUser2.Entity
                        
                     }

                 }
             );
            _dbContext.SaveChanges();

            _dbContext.Venues.Add(
                new Venue
                {
                    Name = _venueName2,
                    Address = _venueAddress2,
                    PostalCode = _postalCode2,
                    ContactPhone = _contactPhone2,
                    ContactEMail = _contactEMail2,
                    OrganizerId = 2
                }
            );
            _dbContext.SaveChanges();
        }
    }
}