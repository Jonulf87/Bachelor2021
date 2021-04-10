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

        //wtf is going on here? Why is this not a task?
        //[HttpGet]
        //[Route("allpolicies")]
        //public List<CrewPermissionsVm> GetAllPoliciesAsync()
        //{
        //    var policies = _securityService.GetAllPoliciesAsync();

        //    return policies;
        //}
    }
}
