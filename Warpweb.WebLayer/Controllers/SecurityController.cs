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
    public class SecurityController : ControllerBase
    {
        private readonly SecurityService _securityService;

        public SecurityController(SecurityService securityService)
        {
            _securityService = securityService;
        }

        [HttpGet]
        [Route("policies")]
        public async Task<ActionResult<List<CrewPermissionType>>> GetPoliciesAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var policies = await _securityService.GetPoliciesAsync(userId);

            return Ok(policies);
        }

        [HttpGet]
        [Route("allpolicies")]
        public async Task<List<CrewPermissionsVm>> GetAllPoliciesAsync(int crewId)
        {
            var policies = await  _securityService.GetAllPoliciesAsync(crewId);

            return policies;
        }
    }
}
