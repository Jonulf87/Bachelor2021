using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class VenueControllerTest : BaseTest
    {
        private const string _venueName1 = "Venue name 1";
        private const string _venueAddress1 = "Testing gate, 213";
        private const int _venueAreaAvailable1 = 10;
        private const int _venueCapacity1 = 1;
        private const string _venueName2 = "Venue name 1";
        private const string _venueAddress2 = "Testing gate 214";
        private const int _venueAreaAvailable2 = 20;
        private const int _venueCapacity2 = 2;

        [Test]
        public async Task ShouldGetVenues()
        {
            CreateVenues();

            VenueService venueService = new VenueService(_dbContext);
            VenueController venueController = new VenueController(venueService);

            List<VenueListVm> result = await venueController.GetVenues();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].VenueId);
            Assert.AreEqual(_venueName1, result[0].VenueName);
            Assert.AreEqual(2, result[1].VenueId);
            Assert.AreEqual(_venueName2, result[1].VenueName);
        }

        [Test]
        public async Task ShouldGetVenueById()
        {
            CreateVenues();

            VenueService venueService = new VenueService(_dbContext);
            VenueController venueController = new VenueController(venueService);

            ActionResult<VenueVm> result1 = await venueController.GetVenue(1);

            VenueVm returnedVenue1 = result1.Value;
            Assert.AreEqual(1, returnedVenue1.VenueId);
            Assert.AreEqual(_venueName1, returnedVenue1.VenueName);
            Assert.AreEqual(_venueAddress1, returnedVenue1.VenueAddress);
            Assert.AreEqual(_venueAreaAvailable1, returnedVenue1.VenueAreaAvailable);
            Assert.AreEqual(_venueCapacity1, returnedVenue1.VenueCapacity);

            ActionResult<VenueVm> result2 = await venueController.GetVenue(2);

            VenueVm returnedVenue2 = result2.Value;
            Assert.AreEqual(2, returnedVenue2.VenueId);
            Assert.AreEqual(_venueName2, returnedVenue2.VenueName);
            Assert.AreEqual(_venueAddress2, returnedVenue2.VenueAddress);
            Assert.AreEqual(_venueAreaAvailable2, returnedVenue2.VenueAreaAvailable);
            Assert.AreEqual(_venueCapacity2, returnedVenue2.VenueCapacity);
        }

        [Test]
        public async Task ShouldCreateVenue()
        {
            CreateVenues();

            string venueName3 = "Venue name 3";
            string venueAddress3 = "Testing gate 215";
            int venueAreaAvailable3 = 30;
            int venueCapacity3 = 3;

            VenueService venueService = new VenueService(_dbContext);
            VenueController venueController = new VenueController(venueService);

            VenueVm venueVm = new VenueVm { VenueName = venueName3, VenueAddress = venueAddress3, VenueAreaAvailable = venueAreaAvailable3, VenueCapacity = venueCapacity3 };

            ActionResult<VenueVm> result = await venueController.CreateVenue(venueVm);

            VenueVm createdVenue = (VenueVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(3, createdVenue.VenueId);
            Assert.AreEqual(venueName3, createdVenue.VenueName);
            Assert.AreEqual(venueAddress3, createdVenue.VenueAddress);
            Assert.AreEqual(venueAreaAvailable3, createdVenue.VenueAreaAvailable);
            Assert.AreEqual(venueCapacity3, createdVenue.VenueCapacity);

            // Check what we really have in the DB
            Venue venue1 = _dbContext.Venues.Find(3);
            Assert.AreEqual(3, venue1.VenueId);
            Assert.AreEqual(venueName3, venue1.VenueName);
            Assert.AreEqual(venueAddress3, venue1.VenueAddress);
            Assert.AreEqual(venueAreaAvailable3, venue1.VenueAreaAvailable);
            Assert.AreEqual(venueCapacity3, venue1.VenueCapacity);
        }

        [Test]
        public async Task ShouldUpdateVenue()
        {
            CreateVenues();

            string newVenueName = "Venue name ";
            string newVenueAddress = "Testing gate 216";
            int newVenueAreaAvailable = 40;
            int newVenueCapacity = 4;

            VenueService venueService = new VenueService(_dbContext);
            VenueController venueController = new VenueController(venueService);

            VenueVm venueVm = new VenueVm { VenueId = 1, VenueName = newVenueName, VenueAddress = newVenueAddress, VenueAreaAvailable = newVenueAreaAvailable, VenueCapacity = newVenueCapacity };

            await venueController.UpdateVenue(venueVm);

            // Check that only one has been changed
            Venue venue1 = _dbContext.Venues.Find(1);
            Assert.AreEqual(newVenueName, venue1.VenueName);
            Assert.AreEqual(newVenueAddress, venue1.VenueAddress);
            Assert.AreEqual(newVenueAreaAvailable, venue1.VenueAreaAvailable);
            Assert.AreEqual(newVenueCapacity, venue1.VenueCapacity);

            Venue venue2 = _dbContext.Venues.Find(2);
            Assert.AreEqual(_venueName2, venue2.VenueName);
            Assert.AreEqual(_venueAddress2, venue2.VenueAddress);
            Assert.AreEqual(_venueAreaAvailable2, venue2.VenueAreaAvailable);
            Assert.AreEqual(_venueCapacity2, venue2.VenueCapacity);
        }


        // Helper methods
        private void CreateVenues()
        {
            _dbContext.Venues.Add(new Venue { VenueName = _venueName1, VenueAddress = _venueAddress1, VenueAreaAvailable = _venueAreaAvailable1, VenueCapacity = _venueCapacity1 });
            _dbContext.SaveChanges();
            _dbContext.Venues.Add(new Venue { VenueName = _venueName2, VenueAddress = _venueAddress2, VenueAreaAvailable = _venueAreaAvailable2, VenueCapacity = _venueCapacity2 });
            _dbContext.SaveChanges();
        }
    }
}
