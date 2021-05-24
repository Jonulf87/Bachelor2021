using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
        public async Task<ActionResult<List<MainEventListVm>>> GetMainEventsAsync()
        {
            var mainEvents = await _mainEventService.GetMainEventsAsync();
            return Ok(mainEvents);
        }

        /// <summary>
        /// Returns all upcoming events with endtime later than now
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("upcomingevents")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MainEventListVm>>> GetUpcomingEventsAsync()
        {
            var upcomingEvents = await _mainEventService.GetUpcomingEventsAsync();
            return Ok(upcomingEvents);
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
            return Ok(mainevent);
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

            await _mainEventService.CreateMainEventAsync(mainEventVm, userId);
            Log.Information("MainEvent {@mainEventVm} created by User {userId} saved to db", mainEventVm, userId);
            return Ok();
        }

        /// <summary>
        /// Updates a specific Event.
        /// </summary>
        /// <param name="mainEventVm"></param>  
        [HttpPut]
        [Route("updateevent")]
        public async Task<ActionResult> UpdateMainEventAsync(MainEventVm mainEventVm)
        {
            var organizers = await _securityService.GetOrganizersUserIsAdminAtAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId))
            {
                return Forbid();
            }

            await _mainEventService.UpdateMainEventAsync(mainEventVm);
            Log.Information("MainEvent {@mainEventVm} updated", mainEventVm);
            return Ok();

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

            await _mainEventService.SetCurrentEventAsync(eventId, userId);
            return Ok();
        }

        /// <summary>
        /// Returns current active event
        /// </summary>
        [HttpGet]
        [Route("getcurrentmainevent")]
        public async Task<ActionResult<CurrentMainEventVm>> GetCurrentMainEventAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _mainEventService.GetCurrentMainEventAsync(userId);
        }

        /// <summary>
        /// Returns events where current user is organization admin
        /// </summary>
        [HttpGet]
        [Route("orgadminmainevents")]
        public async Task<ActionResult<List<MainEventListVm>>> GetMainEventsForOrgAdminAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var events = await _mainEventService.GetMainEventsForOrgAdminAsync(userId);
            return Ok(events);
        }

        /// <summary>
        /// Returns events where current user is participant
        /// </summary>
        [HttpGet]
        [Route("eventsparticipation")]
        public async Task<ActionResult<List<UserMainEventsVm>>> GetMainEventsOfUserParticipationAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<UserMainEventsVm> events = await _mainEventService.GetMainEventsOfUserParticipationAsync(userId);
            return Ok(events);
        }

        /// <summary>
        /// Checks if user inputed eventname already exists
        /// </summary>
        /// <param name="eventname"></param>
        /// <returns>True if name is already in use</returns>
        [HttpGet]
        [Route("checkeventname/{eventname}")]
        public async Task<ActionResult<EventNameCheckVm>> CheckEventNameAsync(string eventname)
        {
            return await _mainEventService.CheckEventNameAsync(eventname);
        }
    }
}
