using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/tickettypes")]
    [ApiController]
    [Authorize]

    public class TicketTypeController : ControllerBase
    {
        private readonly TicketTypeService _ticketTypeService;

        public TicketTypeController(TicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("eventtickettypes/{eventId}")]
        public async Task<ActionResult<List<TicketTypeListVm>>> GetTicketTypesForEventAsync(int eventId)
        {
            try
            {
                var tickets = await _ticketTypeService.GetTicketTypesForEventAsync(eventId);
                return Ok(tickets);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns all ticket types
        /// </summary>
        [HttpGet]
        [Route("tickettypes")]
        public async Task<List<TicketTypeListVm>> GetTicketTypesAsync()
        {
            return await _ticketTypeService.GetTicketTypesAsync();
        }

        /// <summary>
        /// Return specific ticket type
        /// </summary>
        /// <param name="ticketTypeId"></param>  
        [HttpGet]
        [Route("type/{ticketTypeId}")]
        [Authorize(Policy = "TicketAdmin")]
        public async Task<ActionResult<TicketTypeVm>> GetTicketTypeAsync(int ticketTypeId)
        {
            try
            {
                var ticketType = await _ticketTypeService.GetTicketTypeAsync(ticketTypeId);
                return Ok(ticketType);
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }

        /// <summary>
        /// Create ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpPost]
        [Route("createtickettype")]
        [Authorize(Policy = "TicketAdmin")]
        public async Task<ActionResult> CreateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {

            try
            {
                await _ticketTypeService.CreateTicketTypeAsync(ticketTypeVm);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Modify ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpPut]
        [Route("updatetickettype")]
        [Authorize(Policy = "TicketAdmin")]
        public async Task<ActionResult> UpdateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            try
            {
                await _ticketTypeService.UpdateTicketTypeAsync(ticketTypeVm);
                return Ok();
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Deletes ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpDelete]
        [Route("deletetickettype")]
        [Authorize(Policy = "TicketAdmin")]
        public async Task<ActionResult> DeleteTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            try
            {
                await _ticketTypeService.DeleteTicketTypeAsync(ticketTypeVm);
                return Ok();
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }
        }
    }
}
