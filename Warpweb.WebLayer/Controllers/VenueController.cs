using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admins")]
    public class VenueController : ControllerBase
    {
        private readonly VenueService _venueService;

        public VenueController(VenueService venueService)
        {
            _venueService = venueService;
        }

        [HttpGet]
        public async Task<List<VenueListVm>> GetVenues()
        {
            return await _venueService.GetVenuesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VenueVm>> GetVenue(int id)
        {
            return await _venueService.GetVenueAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<VenueVm>> CreateVenue(VenueVm venueVm)
        {
            int venueId;
            try
            {
                venueId = await _venueService.CreateVenueAsync(venueVm);
            }
            catch (VenueAlreadyExistsException)
            {
                return BadRequest();
            }

            venueVm.VenueId = venueId;
            return Ok(venueVm);
        }

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
