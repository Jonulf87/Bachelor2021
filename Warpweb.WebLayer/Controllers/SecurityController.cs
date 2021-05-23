using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/security")]
    [ApiController]
    [Authorize]
    public class SecurityController : ControllerBase
    {
        private readonly SecurityService _securityService;

        public SecurityController(SecurityService securityService)
        {
            _securityService = securityService;
        }

        /// <summary>
        /// Returns list of permissions for logged in user
        /// </summary>
        [HttpGet]
        [Route("policies")]
        public async Task<ActionResult<List<CrewPermissionType>>> GetPoliciesAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var policies = await _securityService.GetPoliciesAsync(userId);

            return Ok(policies);
        }

        /// <summary>
        /// Returns list of permissions for crew with specific ID
        /// </summary>
        /// <param name="crewId"></param>
        [HttpGet]
        [Route("allpolicies/{crewId}")]
        public async Task<ActionResult<List<CrewPermissionsVm>>> GetAllPoliciesAsync(int crewId)
        {
            var policies = await _securityService.GetAllPoliciesAsync(crewId);

            return policies;
        }

        /// <summary>
        /// Sets permissions for crew with specific ID
        /// </summary>
        /// <param name="permissions"></param>
        /// <param name="crewId"></param>
        [HttpPost]
        [Route("setpolicies/{crewId}")]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult> SetPoliciesAsync([FromBody] List<CrewPermissionsVm> permissions, int crewId)
        {
            await _securityService.SetPoliciesAsync(permissions, crewId);
            Log.Information("Policies {@permissions} for crew {crewId} saved to db", permissions, crewId);
            return Ok();
        }

        /// <summary>
        /// Updates user email
        /// </summary>
        /// <param name="userData"></param>
        [HttpPost]
        [Route("edituseremail")]
        public async Task<ActionResult> SetUserEmailAsync (UserEmailUpdateVm userData)
        {
            await _securityService.SetUserEmailAsync(userData);
            Log.Information("User {@userData} updated", userData);
            return Ok();
        }
        
    }
}
