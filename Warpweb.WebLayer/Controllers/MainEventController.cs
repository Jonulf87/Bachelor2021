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
        [HttpGet("{id}")]
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
            //Check which organizer currently active user belongs to. ClaimTypes.NameIdentifier is the username of active user.
            var organizers = await _securityService.GetOrganizersUserIsAdminAtAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId))
            {
                return Forbid();
            }

            try
            {
                await _mainEventService.CreateMainEventAsync(mainEventVm);
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok(mainEventVm);
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
            }
            catch (MainEventDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(mainEventVm);
        }

        [HttpPut]
        [Route("setcurrentevent")]
        public async Task<ActionResult> SetCurrentEventAsync([FromBody] int eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            await _mainEventService.SetCurrentEventAsync(eventId, userId);

            return Ok();
        }

        /// <summary>
        /// Deletes a specific Event.
        /// </summary>
        /// <param name="maineventVm"></param>  
        [HttpDelete]
        public async Task<ActionResult> DeleteMainEventAsync(MainEventVm maineventVm)
        {
            try
            {
                await _mainEventService.RemoveMainEventAsync(maineventVm);
            }
            catch (MainEventDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(maineventVm);
        }

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
    }
}
