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
        public void ShouldNotGetVenueInvalidId()
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

        //[Test]
        //public async Task ShouldCreateVenue()
        //{
        //    CreateVenues();

        //    string venueName3 = "Venue name 3";
        //    string venueAddress3 = "Testing gate 215";
        //    int venueAreaAvailable3 = 30;
        //    int venueCapacity3 = 3;

        //    VenueService venueService = new VenueService(_dbContext);
        //    VenueController venueController = new VenueController(venueService);

        //    VenueVm venueVm = new VenueVm { VenueName = venueName3, VenueAddress = venueAddress3, VenueAreaAvailable = venueAreaAvailable3, VenueCapacity = venueCapacity3 };

        //    ActionResult<VenueVm> result = await venueController.CreateVenue(venueVm);

        //    VenueVm createdVenue = (VenueVm)((OkObjectResult)result.Result).Value;

        //    // Check object that is returned from the controller
        //    Assert.AreEqual(3, createdVenue.VenueId);
        //    Assert.AreEqual(venueName3, createdVenue.VenueName);
        //    Assert.AreEqual(venueAddress3, createdVenue.VenueAddress);
        //    Assert.AreEqual(venueAreaAvailable3, createdVenue.VenueAreaAvailable);
        //    Assert.AreEqual(venueCapacity3, createdVenue.VenueCapacity);

        //    // Check what we really have in the DB
        //    Venue venue1 = _dbContext.Venues.Find(3);
        //    Assert.AreEqual(3, venue1.VenueId);
        //    Assert.AreEqual(venueName3, venue1.VenueName);
        //    Assert.AreEqual(venueAddress3, venue1.VenueAddress);
        //    Assert.AreEqual(venueAreaAvailable3, venue1.VenueAreaAvailable);
        //    Assert.AreEqual(venueCapacity3, venue1.VenueCapacity);
        //}

        //[Test]
        //public async Task ShouldUpdateVenue()
        //{
        //    CreateVenues();

        //    string newVenueName = "Venue name ";
        //    string newVenueAddress = "Testing gate 216";
        //    int newVenueAreaAvailable = 40;
        //    int newVenueCapacity = 4;

        //    VenueService venueService = new VenueService(_dbContext);
        //    VenueController venueController = new VenueController(venueService);

        //    VenueVm venueVm = new VenueVm { VenueId = 1, VenueName = newVenueName, VenueAddress = newVenueAddress, VenueAreaAvailable = newVenueAreaAvailable, VenueCapacity = newVenueCapacity };

        //    await venueController.UpdateVenue(venueVm);

        //    // Check that only one has been changed
        //    Venue venue1 = _dbContext.Venues.Find(1);
        //    Assert.AreEqual(newVenueName, venue1.VenueName);
        //    Assert.AreEqual(newVenueAddress, venue1.VenueAddress);
        //    Assert.AreEqual(newVenueAreaAvailable, venue1.VenueAreaAvailable);
        //    Assert.AreEqual(newVenueCapacity, venue1.VenueCapacity);

        //    Venue venue2 = _dbContext.Venues.Find(2);
        //    Assert.AreEqual(_venueName2, venue2.VenueName);
        //    Assert.AreEqual(_venueAddress2, venue2.VenueAddress);
        //    Assert.AreEqual(_venueAreaAvailable2, venue2.VenueAreaAvailable);
        //    Assert.AreEqual(_venueCapacity2, venue2.VenueCapacity);
        //}


        // Helper methods
        private void CreateVenues()
        {
            _dbContext.Organizers.Add(
                 new Organizer
                 {
                     Name = "Organizer 2",
                     OrgNumber = "1234567",
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
