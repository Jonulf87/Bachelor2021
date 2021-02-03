using System;
using System.Collections.Generic;
using System.Linq;
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

        public MainEventController(MainEventService mainEventService)
        {
            _mainEventService = mainEventService;
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
        public async Task<ActionResult> CreateMainEvent(MainEventVm maineventVm)
        {
            var organizers = _securityService.GetOrganizers(User.Identity.Name);
            if (!organizers.Any(a => a.Id == maineventVm.OrganizerId))
            {
                return Forbid();
            }

            await _mainEventService.CreateMainEventAsync(maineventVm);

            return Ok();
        } */

        [HttpPut]
        public async Task<ActionResult> UpdateMainEvent (MainEventVm maineventVm)
        {
            await _mainEventService.UpdateMainEventAsync(maineventVm);

            return Ok();
        }
    }
}
