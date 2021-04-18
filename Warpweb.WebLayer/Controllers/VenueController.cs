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
        /// <returns>VenueListVm</returns>
        [HttpGet]
        [Route("venueslist")]
        public async Task<List<VenueListVm>> GetVenuesAsync()
        {
            return await _venueService.GetVenuesAsync();
        }

        /// <summary>
        /// Returns only Venues under Tenant
        /// </summary>
        /// <returns>VenueListVm</returns>
        [HttpGet]
        [Route("organizervenueslist")]
        public async Task<List<VenueListVm>> GetOrganizerVenuesAsync()
        {
            return await _venueService.GetOrganizerVenuesAsync();
        }

        /// <summary>
        /// Returns a specific Venue.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>VenueVm</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<VenueVm>> GetVenueAsync(int id)
        {
            return await _venueService.GetVenueAsync(id);
        }

        /// <summary>
        /// Create a Venue.
        /// </summary>
        /// <param name="venueVm"></param>
        /// <returns>VenueVm</returns>
        [HttpPost]
        public async Task<ActionResult<VenueVm>> CreateVenueAsync(VenueVm venueVm)
        {

            try
            {
                await _venueService.CreateVenueAsync(venueVm);
                return Ok(venueVm);
            }
            catch (ItemAlreadyExistsException)
            {
                return Conflict($"Lokalet med navn: {venueVm.Name} eksisterer fra før");
            }

        }

        /// <summary>
        /// Modify specific venue
        /// </summary>
        /// <param name="venueVm"></param>  
        [HttpPut]
        public async Task<ActionResult> UpdateVenueAsync(VenueVm venueVm)
        {
            try
            {
                await _venueService.UpdateVenueAsync(venueVm);
                return Ok(venueVm);
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }
        }

    }
}
