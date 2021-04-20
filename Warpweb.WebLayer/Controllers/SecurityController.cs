using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<List<CrewPermissionsVm>> GetAllPoliciesAsync(int crewId)
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
            return Ok();
        }
    }
}
