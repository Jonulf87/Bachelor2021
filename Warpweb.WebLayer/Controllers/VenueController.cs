using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Warpweb.DataAccessLayer.Models;
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
        public async Task<ActionResult<List<VenueListVm>>> GetVenuesAsync()
        {
            var venues = await _venueService.GetVenuesAsync();
            return Ok(venues);
        }

        /// <summary>
        /// Returns only Venues under Tenant
        /// </summary>
        /// <returns>VenueListVm</returns>
        [HttpGet]
        [Route("organizervenueslist")]
        public async Task<ActionResult<List<VenueListVm>>> GetOrganizerVenuesAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!await _securityService.IsOrgAdmin(userId) && !await _securityService.HasCrewPermissionAsync(userId, CrewPermissionType.VenueAdmin))
            {
                return Forbid();
            }

            return await _venueService.GetOrganizerVenuesAsync();

        }

        /// <summary>
        /// Returns a specific Venue.
        /// </summary>
        /// <param name="venueId"></param>
        /// <returns>VenueVm</returns>
        [HttpGet()]
        [Route("getvenue/{venueId}")]
        public async Task<ActionResult<VenueVm>> GetVenueAsync(int venueId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!await _securityService.IsOrgAdmin(userId) && !await _securityService.HasCrewPermissionAsync(userId, CrewPermissionType.VenueAdmin))
            {
                return Forbid();
            }

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
            Log.Information("Venue {@venueVm} saved to db", venueVm);
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
            Log.Information("Venue {@venueVm} updated", venueVm);
            return Ok();
        }

    }
}
