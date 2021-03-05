using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    // CRUD functionality for Crew Roles

    public class CrewRoleController : ControllerBase
    {
        private readonly CrewRoleService _crewroleService;

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
            int crewRoleId;

            try
            {
                crewRoleId = await _crewroleService.CreateCrewRoleAsync(crewroleVm);
            }
            catch (CrewRoleAlreadyExistsException)
            {
                return BadRequest();
            }

            crewroleVm.CrewRoleId = crewRoleId;
            return Ok(crewroleVm);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCrewRole(CrewRoleVm crewroleVm)
        {
            try
            {
                await _crewroleService.UpdateCrewRoleAsync(crewroleVm);
            }
            catch (CrewRoleDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(crewroleVm);
        }

        // TODO: Restrict to SuperAdmin
        [HttpDelete]
        public async Task<ActionResult> DeleteCrewRole(CrewRoleVm crewroleVm)
        {
            try
            {
                await _crewroleService.DeleteCrewRoleAsync(crewroleVm);
            }
            catch (MainEventDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(crewroleVm);
        }
    }
}
