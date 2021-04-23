using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/events")]
    [ApiController]
    [Authorize]
    public class MainEventController : ControllerBase
    {
        private readonly MainEventService _mainEventService;
        private readonly SecurityService _securityService;

        public MainEventController(MainEventService mainEventService, SecurityService securityService)
        {
            _mainEventService = mainEventService;
            _securityService = securityService;
        }
        /// <summary>
        /// Returns all events
        /// </summary>
        [HttpGet]
        [Route("eventslist")]
        [AllowAnonymous]
        public async Task<List<MainEventListVm>> GetMainEventsAsync()
        {
            return await _mainEventService.GetMainEventsAsync();
        }

        /// <summary>
        /// Returns a specific Event.
        /// </summary>
        /// <param name="id"></param>  
        [HttpGet("getmainevent/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<MainEventVm>> GetMainEventAsync(int id)
        {
            var mainevent = await _mainEventService.GetMainEventAsync(id);


            if (mainevent == null)
            {
                return NotFound();
            }

            return mainevent;
        }

        /// <summary>
        /// Creates a new Event.
        /// </summary>
        /// <param name="mainEventVm"></param>  
        [HttpPost]
        [Route("createmainevent")]
        public async Task<ActionResult> CreateMainEventAsync(MainEventVm mainEventVm)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var organizers = await _securityService.GetOrganizersUserIsAdminAtAsync(userId); //Sjekker hvis bruker er orgadmin i org de prøver å opprette arrangement i

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId))
            {
                return Forbid();
            }

            try
            {
                await _mainEventService.CreateMainEventAsync(mainEventVm, userId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Updates a specific Event.
        /// </summary>
        /// <param name="mainEventVm"></param>  
        [HttpPut]
        public async Task<ActionResult> UpdateMainEventAsync(MainEventVm mainEventVm)
        {
            var organizers = await _securityService.GetOrganizersUserIsAdminAtAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId))
            {
                return Forbid();
            }

            try
            {
                await _mainEventService.UpdateMainEventAsync(mainEventVm);
                return Ok();
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Sets the active event
        /// </summary>
        /// <param name="eventId"></param>  
        [HttpPut]
        [Route("setcurrentevent")]
        public async Task<ActionResult> SetCurrentEventAsync([FromBody] int eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try {
                await _mainEventService.SetCurrentEventAsync(eventId, userId);
                return Ok();
            } 
            catch (HttpException) {
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns current active event
        /// </summary>
        [HttpGet]
        [Route("getcurrentmainevent")]
        public async Task<ActionResult<CurrentMainEventVm>> GetCurrentMainEventAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try
            {
                return await _mainEventService.GetCurrentMainEventAsync(userId);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns events where current user is organization admin
        /// </summary>
        [HttpGet]
        [Route("orgadminmainevents")]
        public async Task<ActionResult<List<MainEventListVm>>> GetMainEventsForOrgAdminAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try
            {
                var events = await _mainEventService.GetMainEventsForOrgAdminAsync(userId);
                return Ok(events);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
