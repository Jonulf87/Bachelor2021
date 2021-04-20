using System;
using System.Collections.Generic;
using System.Security.Claims;
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
        [Route("gettenants")]
        [Authorize(Roles = "Admin")]
        public async Task<List<OrganizerListVm>> GetOrganizersAsync()
        {
            var organizers = await _organizerService.GetOrganizersAsync();
            return organizers;
        }

        /// <summary>
        /// Return specific tentant/organizer
        /// </summary>
        /// <param name="orgId"></param> 
        [HttpGet("getorganizer/{orgId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrganizerVm>> GetOrganizerAsync(int orgId)
        {
            var organizer = await _organizerService.GetOrganizerAsync(orgId);

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
        [Route("addorganizer")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateOrganizerAsync(OrganizerVm organizerVm)
        {

            try
            {
                await _organizerService.CreateOrganizerAsync(organizerVm);
                return Ok();
            }
            catch (ItemAlreadyExistsException)
            {
                return BadRequest();
            }


        }

        /// <summary>
        /// Create tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
        [HttpPut]
        [Route("updateorganizer")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateOrganizerAsync(OrganizerVm organizerVm)
        {
            try
            {
                await _organizerService.UpdateOrganizerAsync(organizerVm);
                return Ok();
            }
            catch (ItemAlreadyExistsException)
            {
                return BadRequest();
            }

        }



        /// <summary>
        /// Returns active contact person for organization
        /// </summary>
        /// <param name="orgId"></param> 
        [HttpGet]
        [Route("getcontact/{orgId}")]
        public async Task<ActionResult<List<OrganizerVm>>> GetOrganizerContactAsync(int orgId)
        {

            try
            {
                var contact = await _organizerService.GetOrganizerContactAsync(orgId);
                return Ok(contact);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Sets contact person for organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        [HttpPost]
        [Route("setorgcontact/{orgid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrganizerVm>> SetOrganizerContactAsync(int orgId, [FromBody] string userId)
        {
            try
            {
                var contact = await _organizerService.SetOrganizerContactAsync(orgId, userId);
                return Ok(contact);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns organization administrators
        /// </summary>
        /// <param name="orgId"></param> 
        [HttpGet]
        [Route("getadmins/{orgId}")]
        public async Task<ActionResult<List<OrgAdminVm>>> GetOrgAdminsAsync(int orgId)
        {
            List<OrgAdminVm> admins;
            try
            {
                admins = await _organizerService.GetOrgAdminsAsync(orgId);
            }
            catch (Exception)
            {
                return BadRequest();
            }
            return Ok(admins);
        }

        /// <summary>
        /// Returns organizations where the user is administraor
        /// </summary>
        /// <param>None</param> 
        [HttpGet]
        [Route("getaorgsadmin")]
        public async Task<ActionResult<List<OrganizerListVm>>> GetOrgsWhereUserIsAdminAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try
            {
                var orgs = await _organizerService.GetOrgsWhereUserIsAdminAsync(userId);
                return Ok(orgs);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Add organization administrator
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        [HttpPost]
        [Route("setadmin/{orgId}")]
        [Authorize(Roles = "Admin")] //Skal endres til enten role admin eller orgadmin skal adde andre orgadmins
        public async Task<ActionResult> SetOrgAdminAsync(int orgId, [FromBody] string userId)
        {
            try
            {
                await _organizerService.SetOrgAdminAsync(orgId, userId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Remove organization administrator
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        [HttpPost]
        [Route("removeadmin/{orgId}")]
        [Authorize(Roles = "Admin")] // samme som setorgadminasync()
        public async Task<ActionResult> RemoveOrgAdminAsync(int orgId, [FromBody] string userId)
        {
            try
            {
                await _organizerService.RemoveOrgAdminAsync(orgId, userId);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}
