﻿using System;
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
        public async Task<List<OrganizerListVm>> GetOrganizersAsync()
        {
            var organizers = await _organizerService.GetOrganizersAsync();
            return organizers;
        }

        /// <summary>
        /// Return specific tentant/organizer
        /// </summary>
        /// <param name="id"></param> 
        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizerVm>> GetOrganizerAsync(int id)
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
        [Route("addorganizer")]
        public async Task<ActionResult> CreateOrganizerAsync(OrganizerVm organizerVm)
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
        public async Task<ActionResult> UpdateOrganizerAsync(OrganizerVm organizerVm)
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
        public async Task<ActionResult> DeleteOrganizerAsync(OrganizerVm organizerVm)
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
        /// Add organization administrator
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        [HttpPost]
        [Route("setadmin/{orgId}")]
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
