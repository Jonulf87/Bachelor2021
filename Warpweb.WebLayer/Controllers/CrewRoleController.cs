using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/crewroles")]
    [ApiController]
    [Authorize]

    public class CrewRoleController : ControllerBase
    {
        private readonly CrewRoleService _crewroleService;

        public CrewRoleController(CrewRoleService crewroleService)
        {
            _crewroleService = crewroleService;
        }

        /// <summary>
        /// Returns all crew roles
        /// </summary>
        [HttpGet]
        public async Task<List<CrewRoleListVm>> GetCrewRolesAsync()
        {
            return await _crewroleService.GetCrewRolesAsync();
        }

        /// <summary>
        /// Returns specific crew role
        /// </summary>
        /// <param name="id"></param> 
        [HttpGet("{id}")]
        public async Task<ActionResult<CrewRoleVm>> GetCrewRoleAsync(int id)
        {
            return await _crewroleService.GetCrewRoleAsync(id);
        }

        /// <summary>
        /// Create crew role
        /// </summary>
        /// <param name="crewroleVm"></param> 
        [HttpPost]
        public async Task<ActionResult<CrewRoleVm>> CreateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            int crewRoleId;

            try
            {
                crewRoleId = await _crewroleService.CreateCrewRoleAsync(crewroleVm);
            }
            catch (ItemAlreadyExistsException)
            {
                return BadRequest();
            }

            crewroleVm.CrewRoleId = crewRoleId;
            return Ok(crewroleVm);
        }

        /// <summary>
        /// Modify crew role
        /// </summary>
        /// <param name="crewroleVm"></param> 
        [HttpPut]
        public async Task<ActionResult> UpdateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            try
            {
                await _crewroleService.UpdateCrewRoleAsync(crewroleVm);
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }

            return Ok(crewroleVm);
        }

        /// <summary>
        /// Delete crew role
        /// </summary>
        /// <param name="crewroleVm"></param> 
        [HttpDelete]
        public async Task<ActionResult> DeleteCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            try
            {
                await _crewroleService.DeleteCrewRoleAsync(crewroleVm);
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }

            return Ok(crewroleVm);
        }
    }
}
