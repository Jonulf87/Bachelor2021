using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        /// <summary>
        /// Return all tickets
        /// </summary>
        [HttpGet]
        public async Task<List<TicketListVm>> GetTickets()
        {
            return await _ticketService.GetTicketsAsync();
        }

        /// <summary>
        /// Return specific ticket
        /// </summary>
        /// <param name="id"></param> 
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketVm>> GetTicket(int id)
        {
            return await _ticketService.GetTicketAsync(id);
        }

        /// <summary>
        /// Create ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpPost]
        [Authorize(Roles = "Users")]
        public async Task<ActionResult<TicketVm>> CreateTicket(TicketVm ticketVm)
        {
            int ticketId;
            try
            {
                ticketId = await _ticketService.CreateTicketAsync(ticketVm);
            }
            catch (TicketAlreadyExistsException)
            {
                return BadRequest(); 
            }

            ticketVm.Id = ticketId;
            return Ok(ticketVm);
        }

        /// <summary>
        /// Modify ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpPut]
        [Authorize(Roles = "Admins")]
        public async Task<ActionResult> UpdateTicket(TicketVm ticketVm)
        {
            try
            {
                await _ticketService.UpdateTicketAsync(ticketVm);
            }

            catch (TicketDoesNotExistException)
            {
                return BadRequest();
            }
            return Ok(ticketVm);
        }

        /// <summary>
        /// Delete ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpDelete]
        public async Task<ActionResult> DeleteTicket(TicketVm ticketVm)
        {
            try
            {
                await _ticketService.DeleteTicketAsync(ticketVm);
            }
            catch (TicketDoesNotExistException)
            {
                return BadRequest();
            }

            return Ok(ticketVm);
        }
    }
}
