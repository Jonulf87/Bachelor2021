using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/crews")]
    [ApiController]
    [Authorize]

    // CRUD functionality for crew
    // TODO : Crew deletion

    public class CrewController : ControllerBase
    {
        private readonly CrewService _crewService;

        public CrewController(CrewService crewService)
        {
            _crewService = crewService;
        }

        /// <summary>
        /// Returns all crews
        /// </summary>
        [HttpGet]
        public async Task<List<CrewListVm>> GetCrews()
        {
            return await _crewService.GetCrewsAsync();
        }

        /// <summary>
        /// Return specific crew
        /// </summary>
        /// <param name="id"></param> 
        [HttpGet("{id}")]
        public async Task<ActionResult<CrewVm>> GetCrew(int id)
        {
            return await _crewService.GetCrewAsync(id);
        }

        /// <summary>
        /// Create crew
        /// </summary>
        /// <param name="crewVm"></param> 
        [HttpPost]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult<CrewVm>> CreateCrew(CrewVm crewVm)
        {
            int crewId;

            try
            {
                crewId = await _crewService.CreateCrewAsync(crewVm);
            }
            catch (CrewAlreadyExistsException)
            {
                return BadRequest();
            }

            crewVm.CrewId = crewId;
            return Ok(crewVm);
        }

        /// <summary>
        /// Modify crew
        /// </summary>
        /// <param name="crewVm"></param> 
        [HttpPut]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult> UpdateCrew(CrewVm crewVm)
        {
            try
            {
                await _crewService.UpdateCrewAsync(crewVm);
            }

            catch (CrewDoesNotExistException)
            {
                return BadRequest();
            }
            return Ok(crewVm);
        }

        /// <summary>
        /// Delete crew
        /// </summary>
        /// <param name="crewVm"></param> 
        [HttpDelete]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult> DeleteCrew(CrewVm crewVm)
        {
            try
            {
                await _crewService.DeleteCrewAsync(crewVm);
            }
            catch (CrewDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(crewVm);
        }
    }
}
