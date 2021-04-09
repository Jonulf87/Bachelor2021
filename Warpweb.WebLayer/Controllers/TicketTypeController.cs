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

        /// <summary>
        /// Returns all ticket types
        /// </summary>
        [HttpGet]
        public async Task<List<TicketTypeListVm>> GetTicketTypesAsync()
        {
            return await _ticketTypeService.GetTicketTypesAsync();
        }

        /// <summary>
        /// Return specific ticket type
        /// </summary>
        /// <param name="id"></param>  
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketTypeVm>> GetTicketTypeAsync(int id)
        {
            return await _ticketTypeService.GetTicketTypeAsync(id);
        }

        /// <summary>
        /// Create ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpPost]
        [Route("createtickettype")]
        //[Authorize(Roles = "Admins")]
        public async Task<ActionResult> CreateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {

            try
            {
                await _ticketTypeService.CreateTicketTypeAsync(ticketTypeVm);
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok(ticketTypeVm);
        }

        /// <summary>
        /// Modify ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpPut]
        public async Task<ActionResult> UpdateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            try
            {
                await _ticketTypeService.UpdateTicketTypeAsync(ticketTypeVm);
            }
            catch (TicketTypeDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(ticketTypeVm);
        }

        /// <summary>
        /// Deletes ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        [HttpDelete]
        public async Task<ActionResult> DeleteTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            try
            {
                await _ticketTypeService.DeleteTicketTypeAsync(ticketTypeVm);
            }
            catch (TicketDoesNotExistException)
            {
                return BadRequest();
            }
            return Ok(ticketTypeVm);
        }
    }
}
