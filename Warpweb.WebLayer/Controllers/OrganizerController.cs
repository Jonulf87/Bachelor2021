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
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/tenant")]
    [ApiController]
    [Authorize(Roles = "TenantMasterMan")]

    // CRUD functionality for organizer
    // Note Dependency Injection for SecurityService and MainEventService
    public class OrganizerController : ControllerBase
    {
        private readonly OrganizerService _organizerService;

        public OrganizerController(OrganizerService organizerService)
        {
            _organizerService = organizerService;
        }

        [HttpGet]
        public async Task<List<OrganizerListVm>> GetOrganizers()
        {
            return await _organizerService.GetOrganizersAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizerVm>> GetOrganizer(int id)
        {
            var organizer = await _organizerService.GetOrganizerAsync(id);
            
            if (organizer == null)
            {
                return NotFound();
            }

            return organizer;
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrganizer(OrganizerVm organizerVm)
        {
            int orgId;

            try
            {
                orgId = await _organizerService.CreateOrganizerAsync(organizerVm);
            }
            catch (OrganizerAlreadyExistsException)
            {
                return BadRequest();
            }

            organizerVm.Id = orgId;
            return Ok(organizerVm);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateOrganizer(OrganizerVm organizerVm)
        {
            try
            {
                await _organizerService.UpdateOrganizerAsync(organizerVm);
            }
            catch (OrganizerAlreadyExistsException)
            {
                return BadRequest();
            }

            return Ok(organizerVm);
        }

        // TODO: Restrict to SuperAdmin
        [HttpDelete]
        public async Task<ActionResult> DeleteOrganizer(OrganizerVm organizerVm)
        {
            try
            {
                await _organizerService.DeleteOrganizerAsync(organizerVm);
            }
            catch (OrganizerDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(organizerVm);
        }
    }
}
