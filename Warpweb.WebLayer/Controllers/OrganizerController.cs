using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
        public async Task<ActionResult<List<OrganizerListVm>>> GetOrganizersAsync()
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
            await _organizerService.CreateOrganizerAsync(organizerVm);
            Log.Information("Organizer {@organizerVm} saved to db", organizerVm);
            return Ok();
        }

        /// <summary>
        /// Update/modify tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
        [HttpPut]
        [Route("updateorganizer")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateOrganizerAsync(OrganizerVm organizerVm)
        {
            await _organizerService.UpdateOrganizerAsync(organizerVm);
            Log.Information("Organizer {@organizerVm} updated", organizerVm);
            return Ok();
        }

        /// <summary>
        /// Returns active contact person for organization
        /// </summary>
        /// <param name="orgId"></param> 
        [HttpGet]
        [Route("getcontact/{orgId}")]
        public async Task<ActionResult<List<OrganizerVm>>> GetOrganizerContactAsync(int orgId)
        {
            var contact = await _organizerService.GetOrganizerContactAsync(orgId);
            return Ok(contact);
        }

        /// <summary>
        /// Sets active contact person for organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        [HttpPost]
        [Route("setorgcontact/{orgid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrganizerVm>> SetOrganizerContactAsync(int orgId, [FromBody] string userId)
        {
            var contact = await _organizerService.SetOrganizerContactAsync(orgId, userId);
            Log.Information("User {userId} set as contact for Organizer {orgId}", userId, orgId);
            return Ok(contact);
        }

        /// <summary>
        /// Returns organization administrators
        /// </summary>
        /// <param name="orgId"></param> 
        [HttpGet]
        [Route("getadmins/{orgId}")]
        public async Task<ActionResult<List<OrgAdminVm>>> GetOrgAdminsAsync(int orgId)
        {
            List<OrgAdminVm> admins = await _organizerService.GetOrgAdminsAsync(orgId);
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
            var orgs = await _organizerService.GetOrgsWhereUserIsAdminAsync(userId);
            return Ok(orgs);
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
            await _organizerService.SetOrgAdminAsync(orgId, userId);
            Log.Information("User {userId} set as Admin for Organizer {orgId}", userId, orgId);
            return Ok();
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
            await _organizerService.RemoveOrgAdminAsync(orgId, userId);
            Log.Information("User {userId} removed as Admin for Organizer {orgId}", userId, orgId);
            return Ok();
        }

        /// <summary>
        /// Checks if org number is already registered
        /// </summary>
        /// <param name="orgNumber"></param>
        /// <returns>return true if org number is already registered</returns>
        [HttpGet]
        [Route("checkorgnumber/{orgNumber}")]
        public async Task<ActionResult<OrgNumberCheckVm>> CheckOrgNumberAsync(string orgNumber)
        {
            return await _organizerService.CheckOrgNumberAsync(orgNumber);
        }

    }
}
