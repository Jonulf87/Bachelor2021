using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private readonly SecurityService _securityService;

        public VenueController(VenueService venueService, SecurityService securityService)
        {
            _venueService = venueService;
            _securityService = securityService;
        }

        /// <summary>
        /// Returns all Venues.
        /// </summary>
        /// <returns>VenueListVm</returns>
        [HttpGet]
        [Route("venueslist")]
        [Authorize(Policy = "VenueAdmin")]
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
        [Authorize(Policy = "VenueAdmin")] // Sjekk manuelt i metoden og sjekk for policy eller orgadmin
        public async Task<List<VenueListVm>> GetOrganizerVenuesAsync()
        {
            return await _venueService.GetOrganizerVenuesAsync();
        }

        /// <summary>
        /// Returns a specific Venue.
        /// </summary>
        /// <param name="venueId"></param>
        /// <returns>VenueVm</returns>
        [HttpGet()]
        [Route("getvenue/{venueId}")]
        [Authorize(Policy = "VenueAdmin")]
        public async Task<ActionResult<VenueVm>> GetVenueAsync(int venueId)
        {
            var venue = await _venueService.GetVenueAsync(venueId);
            return venue;
        }

        /// <summary>
        /// Create a Venue.
        /// </summary>
        /// <param name="venueVm"></param>
        /// <returns>VenueVm</returns>
        [HttpPost]
        [Route("createvenue")]
        public async Task<ActionResult> CreateVenueAsync(VenueVm venueVm)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var organizers = await _securityService.GetOrganizersUserIsAdminAtAsync(userId);

            if (!organizers.Any(a => a.Id == venueVm.OrganizerId))
            {
                return Forbid();
            }

            await _venueService.CreateVenueAsync(venueVm);
            return Ok();
        }

        /// <summary>
        /// Modify specific venue
        /// </summary>
        /// <param name="venueVm"></param>  
        [HttpPut]
        [Route("updatevenue")]
        [Authorize(Policy = "VenueAdmin")]
        public async Task<ActionResult> UpdateVenueAsync(VenueVm venueVm)
        {
            await _venueService.UpdateVenueAsync(venueVm);
            return Ok();
        }

    }
}
