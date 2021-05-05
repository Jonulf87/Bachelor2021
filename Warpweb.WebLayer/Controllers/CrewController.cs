using System;
using System.Collections.Generic;
using System.Security.Claims;
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
        /// <returns>CrewListVM</returns>
        [HttpGet]
        [Route("allcrews")]
        public async Task<List<CrewListVm>> GetCrewsAsync()
        {
            return await _crewService.GetCrewsAsync();   
        }

        /// <summary>
        /// Return specific crew with id = crewId
        /// </summary>
        /// <param name="crewId">crewId</param>
        /// <returns>CrewVM</returns>
        [HttpGet]
        [Route("getcrew/{crewId}")]
        public async Task<ActionResult<CrewVm>> GetCrewAsync(int crewId)
        {
            return await _crewService.GetCrewAsync(crewId);
        }

        /// <summary>
        /// Create crew
        /// </summary>
        /// <param name="crewName"></param> 
        [HttpPost]
        [Authorize(Policy = "CrewAdmin")]
        [Route("createcrew/{crewName}")]
        public async Task<ActionResult> CreateCrewAsync(string crewName)
        {
            try
            {
                await _crewService.CreateCrewAsync(crewName);
                return Ok();
            }
            catch (HttpException)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Modify crew
        /// </summary>
        /// <param name="crewVm"></param> 
        [HttpPut]
        [Route("updatecrew")]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult> UpdateCrewAsync(CrewVm crewVm)
        {
            try
            {
                await _crewService.UpdateCrewAsync(crewVm);
                return Ok();
            }

            catch (HttpException)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Delete crew
        /// </summary>
        /// <param name="crewVm"></param> 
        [HttpDelete]
        [Route("deletecrew")]
        [Authorize(Policy = "CrewAdmin")]
        public async Task<ActionResult> DeleteCrewAsync(CrewVm crewVm)
        {
            try
            {
                await _crewService.DeleteCrewAsync(crewVm);
                return Ok();
            }
            catch (HttpException)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Returns crewmembers in crew with specific ID
        /// </summary>
        /// <param name="crewId"></param> 
        [HttpGet]
        [Route("crewmembers/{crewId}")]
        public async Task<ActionResult<List<CrewMembersListVm>>> GetCrewMembersAsync(int crewId)
        {
            try
            {
                var membersList = await _crewService.GetCrewMembersAsync(crewId);
                return Ok(membersList);
            }
            catch (HttpException)
            {
                return NotFound("Arbeidslaget eksisterer ikke");
            }
        }

        /// <summary>
        /// Add crewmember to crew with specific ID
        /// </summary>
        /// <param name="crewId"></param>
        /// <param name="userId"></param>
        [HttpPost]
        [Authorize(Policy = "CrewAdmin")]
        [Route("addcrewmember/{crewId}")]
        public async Task<ActionResult> AddCrewMemberAsync(int crewId, [FromBody] string userId)
        {
            try
            {
                await _crewService.AddCrewMemberAsync(crewId, userId);
                return Ok();
            }
            catch(Exception)
            {
                return BadRequest("Kunne ikke legge til crewmedlem!");
            }
        }

        /// <summary>
        /// Get crewleaders from crew with specific ID
        /// </summary>
        /// <param int="crewId"></param>
        [HttpGet]
        [Route("crewleaders/{crewId}")]
        public async Task<ActionResult<List<CrewMembersListVm>>> GetCrewLeadersAsync(int crewId)
        {
            try
            {
                var leaderList = await _crewService.GetCrewLeadersAsync(crewId);
                return Ok(leaderList);
            }
            catch (HttpException)
            {
                return NotFound("Arbeidslaget eksisterer ikke");
            }
        }

        /// <summary>
        /// Add crewleader to crew with specific ID
        /// </summary>
        /// <param int="crewId"></param>
        /// <param string="userId"></param>
        [HttpPost]
        [Authorize(Policy = "CrewAdmin")]
        [Route("addcrewleader/{crewId}")]
        public async Task<ActionResult> AddCrewLeaderAsync(int crewId, [FromBody] string userId)
        {
            try
            {
                await _crewService.AddCrewLeaderAsync(crewId, userId);
                return Ok();
            }
            catch(HttpException)
            {
                return BadRequest("Kunne ikke legge til arbeidslagsleder!");
            }
        }

        /// <summary>
        /// Returns crews current user is member of
        /// </summary>
        [HttpGet]
        [Route("mycrews")]
        public async Task<ActionResult<List<CrewListVm>>> GetCrewsUserIsMemberOfAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                var crews = await _crewService.GetCrewsUserIsMemberOfAsync(userId);
                return Ok(crews);
            }
            catch(HttpException)
            {
                return BadRequest();
            }
        }
    }
}
