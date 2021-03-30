using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/tenants")]
    [ApiController]
    [Authorize]

    // CRUD functionality for organizer
    // Note Dependency Injection for SecurityService and MainEventService
    public class OrganizerController : ControllerBase
    {
        private readonly OrganizerService _organizerService;

        public OrganizerController(OrganizerService organizerService)
        {
            _organizerService = organizerService;
        }

        /// <summary>
        /// Returns all tentants/organizers
        /// </summary>
        [HttpGet]
        public async Task<List<OrganizerListVm>> GetOrganizers()
        {
            return await _organizerService.GetOrganizersAsync();
        }

        /// <summary>
        /// Return specific tentant/organizer
        /// </summary>
        /// <param name="id"></param> 
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

        /// <summary>
        /// Create tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
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

        /// <summary>
        /// Create tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
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

        /// <summary>
        /// Delete tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
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
