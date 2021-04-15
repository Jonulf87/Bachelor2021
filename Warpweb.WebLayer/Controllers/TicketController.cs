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
        /// <returns>TicketListVM</returns>
        [HttpGet]
        public async Task<List<TicketListVm>> GetTicketsAsync()
        {
            return await _ticketService.GetTicketsAsync();
        }

        /// <summary>
        /// Return specific ticket
        /// </summary>
        /// <param name="id"></param>
        /// <returns>TicketVM</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketVm>> GetTicketAsync(int id)
        {
            return await _ticketService.GetTicketAsync(id);
        }

        /// <summary>
        /// Create new ticket
        /// </summary>
        /// <param name="ticketTypeId"></param>
        /// <returns>TicketVM</returns>
        [HttpPost]
        [Route("createticket/{ticketTypeId}")]
        public async Task<ActionResult<TicketVm>> CreateTicketAsync(int ticketTypeId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var ticket = await _ticketService.CreateTicketAsync(ticketTypeId, userId);
                return Ok(ticket);
            }
            catch (ItemAlreadyExistsException)
            {
                return BadRequest(); 
            }
        }

        /// <summary>
        /// Simulates purchase of ticket
        /// </summary>
        /// <param name="ticketId"></param>
        /// <param name="provider"></param>
        [HttpPost]
        [Route("purchaseticket/{ticketId}/{provider}")]
        public async Task<ActionResult> PurchaseTicketAsync(int ticketId, int provider)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                await _ticketService.PurchaseTicketAsync(ticketId, userId, provider);
                return Ok();
            }
            catch
            {
                return BadRequest("HAHA! NO MONEY!");
            }
        }

        /// <summary>
        /// Simulates reservation of seat in seatmap
        /// </summary>
        /// <param name="ticketId"></param>
        [HttpPost]
        [Route("reserveseat/{ticketId}/{seatId}")]
        public async Task<ActionResult> ReserveSeatAsync(int ticketId, int seatId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                await _ticketService.ReserveSeatAsync(ticketId, seatId, userId);
                return Ok();
            }
            catch
            {
                return BadRequest("Kunne ikke reservere sete");
            }
        }

        /// <summary>
        /// Modify ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpPut]
        [Authorize(Roles = "Admins")]
        public async Task<ActionResult> UpdateTicketAsync(TicketVm ticketVm)
        {
            try
            {
                await _ticketService.UpdateTicketAsync(ticketVm);
            }

            catch (ItemNotFoundException)
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
        public async Task<ActionResult> DeleteTicketAsync(TicketVm ticketVm)
        {
            try
            {
                await _ticketService.DeleteTicketAsync(ticketVm);
            }
            catch (ItemNotFoundException)
            {
                return BadRequest();
            }

            return Ok(ticketVm);
        }
    }
}
