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

    public class CrewController : ControllerBase
    {
        private readonly CrewService _crewService;

        public CrewController (CrewService crewService)
        {
            _crewService = crewService;
        }

        [HttpGet]
        public async Task<List<CrewListVm>> GetCrews()
        {
            return await _crewService.GetCrewsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CrewVm>> GetCrew(int id)
        {
            return await _crewService.GetCrewAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<CrewVm>> CreateCrew(CrewVm crewVm)
        {

            try
            {
                await _crewService.CreateCrewAsync(crewVm);
            }
            catch (CrewAlreadyExistsException)
            {
                return BadRequest();
            }
          
            return Ok(crewVm);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCrew(CrewVm crewVm)
        {
            await _crewService.UpdateCrewAsync(crewVm);

            return Ok();
        }
    }
}
