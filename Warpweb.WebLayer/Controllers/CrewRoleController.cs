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
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admins")]

    public class CrewRoleController : ControllerBase
    {
        public readonly CrewRoleService _crewroleService;

        public CrewRoleController(CrewRoleService crewroleService)
        {
            _crewroleService = crewroleService;
        }

        [HttpGet]
        public async Task<List<CrewRoleListVm>> GetCrewRoles()
        {
            return await _crewroleService.GetCrewRolesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CrewRoleVm>> GetCrewRole(int id)
        {
            return await _crewroleService.GetCrewRoleAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<CrewRoleVm>> CreateCrewRole(CrewRoleVm crewroleVm)
        {

            try
            {
                await _crewroleService.CreateCrewRoleAsync(crewroleVm);
            }
            catch (CrewRoleAlreadyExistsException)
            {
                return BadRequest();
            }

            return Ok(crewroleVm);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCrewRole(CrewRoleVm crewroleVm)
        {
            await _crewroleService.UpdateCrewRoleAsync(crewroleVm);

            return Ok();
        }
    }
}
