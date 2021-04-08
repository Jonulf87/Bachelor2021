using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/venues")]
    [ApiController]
    [Authorize]
    public class VenueController : ControllerBase
    {
        private readonly VenueService _venueService;

        public VenueController(VenueService venueService)
        {
            _venueService = venueService;
        }

        /// <summary>
        /// Returns all Venues.
        /// </summary>
        [HttpGet]
        [Route("venueslist")]
        public async Task<List<VenueListVm>> GetVenues()
        {
            return await _venueService.GetVenuesAsync();
        }

        /// <summary>
        /// Returns only Venues under Tenant
        /// </summary>
        [HttpGet]
        [Route("organizervenueslist")]
        public async Task<List<VenueListVm>> GetOrganizerVenues()
        {
            return await _venueService.GetOrganizerVenuesAsync();
        }

        /// <summary>
        /// Returns a specific Venue.
        /// </summary>
        /// <param name="id"></param>  
        [HttpGet("{id}")]
        public async Task<ActionResult<VenueVm>> GetVenue(int id)
        {
            return await _venueService.GetVenueAsync(id);
        }

        /// <summary>
        /// Create a Venue.
        /// </summary>
        /// <param name="venueVm"></param>  
        [HttpPost]
        public async Task<ActionResult<VenueVm>> CreateVenue(VenueVm venueVm)
        {
            int venueId;

            if (venueVm.Id > 0)
            {
                return BadRequest("VenueId should be empty");
            }

            if("".Equals(venueVm.Name))
            {
                return BadRequest("Venue name should not be empty");
            }

            if ("".Equals(venueVm.PostalCode))
            {
                return BadRequest("Venue postal code should not be empty");
            }

            if ("".Equals(venueVm.Address))
            {
                return BadRequest("Venue address should not be empty");
            }

            if("".Equals(venueVm.ContactName))
            {
                return BadRequest("Contact name should not be empty");
            }

            if("".Equals(venueVm.ContactPhone))
            {
                return BadRequest("Contact phone should not be empty");
            }
            if ("".Equals(venueVm.ContactEMail))
            {
                return BadRequest("Contact e-mail should not be empty");
            }

            try
            {
                venueId = await _venueService.CreateVenueAsync(venueVm);
            }
            catch (VenueAlreadyExistsException)
            {
                return Conflict("Venue with this name already exists");
            }

            venueVm.Id = venueId;
            return Ok(venueVm);
        }

        /// <summary>
        /// Modify specific venue
        /// </summary>
        /// <param name="venueVm"></param>  
        [HttpPut]
        public async Task<ActionResult> UpdateVenue(VenueVm venueVm)
        {
            try
            {
                await _venueService.UpdateVenueAsync(venueVm);
            }
            catch (VenueDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(venueVm);
        }

    }
}
