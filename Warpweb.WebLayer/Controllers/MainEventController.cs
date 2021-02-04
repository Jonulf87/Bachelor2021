using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/arrangement")]
    [ApiController]
    [Authorize(Roles = "Admins")]
    [Authorize(Roles = "CrewLeader")]
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

        /*
        [HttpPost]
        public async Task<ActionResult> CreateMainEvent(MainEventVm mainEventVm)
        {
            var organizers = _securityService.GetOrganizers(User.FindFirstValue(ClaimTypes.NameIdentifier)); //Sjekker hvilken arrangør brukeren er affiliert med.

            if (!organizers.Any(a => a.Id == mainEventVm.OrganizerId)) //What is this shit!!??!! Why the squiggly line??!!??! Sjekke at navnet på arrangementet ikke allerede er tatt?
            {
                return Forbid();
            }

            await _mainEventService.CreateMainEventAsync(mainEventVm);

            return Ok();
        } */

        [HttpPut]
        public async Task<ActionResult> UpdateMainEvent (MainEventVm maineventVm)
        {
            await _mainEventService.UpdateMainEventAsync(maineventVm);

            return Ok();
        }

        // TODO: Restrict to SuperAdmin ?
        [HttpDelete]
        public async Task<ActionResult> DeleteMainEvent (MainEventVm maineventVm)
        {
            await _mainEventService.RemoveMainEventAsync(maineventVm);
            return Ok();
        }
    }
}
