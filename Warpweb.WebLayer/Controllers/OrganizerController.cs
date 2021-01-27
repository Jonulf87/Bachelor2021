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
    [Route("api/tenant")]
    [ApiController]
    [Authorize(Roles = "TenantMasterMan")]
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
            await _organizerService.CreateOrganizerAsync(organizerVm);

            return Ok();
        }
    }
}
