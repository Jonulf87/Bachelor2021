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
    [Route("api/arrangement")]
    [ApiController]
    [Authorize(Roles = "admin")]

    // CRUD functionality for events
    // Note Dependency Injection for SecurityService and MainEventService

    public class MainEventController : ControllerBase 
    {
        private readonly MainEventService _mainEventService;
        private readonly SecurityService _securityService;

        public MainEventController(MainEventService mainEventService, SecurityService securityService)
        {
            _mainEventService = mainEventService;
            _securityService = securityService;
        }

        [HttpGet]
        
        public async Task<List<MainEventListVm>> GetMainEvents()
        {
            return await _mainEventService.GetMainEventsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MainEventVm>> GetMainEvent(int id)
        {
            var mainevent = await _mainEventService.GetMainEventAsync(id);

            if (mainevent == null)
            {
                return NotFound();
            }

            return mainevent;
        }
        
        [HttpPost]
        public async Task<ActionResult> CreateMainEvent(MainEventVm mainEventVm)
        {
            // Check which organizer currently active user belongs to. ClaimTypes.NameIdentifier is the username of active user.
            var organizers = await _securityService.GetOrganizersAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId)) 
            {
                return Forbid();
            }

            int mainEventId;

            try
            {
                mainEventId = await _mainEventService.CreateMainEventAsync(mainEventVm);
            }
            catch (Exception)
            {
                return BadRequest();
            }

            mainEventVm.Id = mainEventId;
            return Ok(mainEventVm);
        } 

        [HttpPut]
        public async Task<ActionResult> UpdateMainEvent (MainEventVm maineventVm)
        {
            try
            {
                await _mainEventService.UpdateMainEventAsync(maineventVm);
            }
            catch (MainEventDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(maineventVm);
        }

        // TODO: Restrict to SuperAdmin
        [HttpDelete]
        public async Task<ActionResult> DeleteMainEvent (MainEventVm maineventVm)
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
    }
}
