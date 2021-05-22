using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
        /// Gets all tickets of user
        /// </summary>
        /// <returns>TicketListVm</returns>
        [HttpGet]
        [Route("usertickets")]
        public async Task<ActionResult<List<TicketListVm>>> GetAllTicketsOfUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _ticketService.GetAllTicketsOfUserAsync(userId);
        }

        /// <summary>
        /// Gets all tickets of user of upcoming events
        /// </summary>
        /// <returns>UserTicketsUpcomingVm</returns>
        [HttpGet]
        [Route("userticketsupcoming")]
        public async Task<ActionResult<List<UserTicketsUpcomingVm>>> GetAllUserTicketsUpcomingAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<UserTicketsUpcomingVm> tickets = await _ticketService.GetAllUserTicketsUpcomingAsync(userId);
            return Ok(tickets);
        }

        /// <summary>
        /// Return all tickets
        /// </summary>
        /// <returns>TicketListVM</returns>
        [HttpGet]
        public async Task<ActionResult<List<TicketListVm>>> GetTicketsAsync()
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
        /// Returns list of tickets held by current user of that event
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns>List of TicketVM</returns>
        [HttpGet]
        [Route("alltickets/{eventId}")]
        public async Task<ActionResult<List<TicketListVm>>> GetAllTiccketsUserEventAsync(int eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tickets = await _ticketService.GetAllTicketsUserEventAsync(userId, eventId);
            return Ok(tickets);

        }

        /// <summary>
        /// Returns list of unpaid tickets held by current user of that event
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns>TicketVM</returns>
        [HttpGet]
        [Route("allticketsunpaid/{eventId}")]
        public async Task<ActionResult<List<TicketListVm>>> GetAllTicketsUserEventUnpaidAsync(int eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tickets = await _ticketService.GetAllTicketsUserEventUnpaidAsync(userId, eventId);
            return Ok(tickets);
        }

        /// <summary>
        /// Create new ticket
        /// </summary>
        /// <param name="tickets"></param>
        /// <returns>Ticket list</returns>
        [HttpPost]
        [Route("createticket")]
        public async Task<ActionResult> CreateTicketsAsync([FromBody] List<TicketsToBuyVm> tickets)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                await _ticketService.CreateTicketsAsync(tickets, userId);
                Log.Information("Tickets {@tickets} created for user {userId}", tickets, userId);
                return Ok();
            }
            catch (NoGuardianSetForMinorException)
            {
                ModelState.AddModelError("", "Foresatte info mangler");
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Simulates purchase of ticket
        /// </summary>
        [HttpPost]
        [Route("purchaseticket")]
        public async Task<ActionResult> PurchaseTicketsAsync(List<TicketsToBuyVm> tickets)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _ticketService.PurchaseTicketsAsync(tickets, userId);
            Log.Information("Tickets {@tickets} purchased by user {userId}", tickets, userId);
            return Ok();
        }

        /// <summary>
        /// Simulates reservation of seat in seatmap
        /// </summary>
        /// <param name="ticketId"></param>
        /// <param name="seatId"></param>
        [HttpPost]
        [Route("reserveseat/{ticketId}/{seatId}")]
        public async Task<ActionResult> ReserveSeatAsync(int ticketId, int seatId)
        {

            await _ticketService.ReserveSeatAsync(ticketId, seatId);
            Log.Information("Seat {seatId} reserved for ticket {ticketId}", seatId, ticketId);
            return Ok();
        }

        /// <summary>
        /// Modify ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateTicketAsync(TicketVm ticketVm)
        {

            await _ticketService.UpdateTicketAsync(ticketVm);
            Log.Information("Ticket {@ticketVm} updated", ticketVm);
            return Ok(ticketVm);
        }

        /// <summary>
        /// Delete ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        [HttpDelete]
        public async Task<ActionResult> DeleteTicketAsync(TicketVm ticketVm)
        {

            await _ticketService.DeleteTicketAsync(ticketVm);
            Log.Information("Ticket {@ticketVm} deleted", ticketVm);
            return Ok(ticketVm);
        }
    }
}
