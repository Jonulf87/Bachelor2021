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
        /// <returns></returns>
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
            try
            {
                var tickets = await _ticketService.GetAllTicketsUserEventAsync(userId, eventId);
                return Ok(tickets);
            }
            catch (Exception)
            {
                return BadRequest();
            }
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
            try
            {
                var tickets = await _ticketService.GetAllTicketsUserEventUnpaidAsync(userId, eventId);
                return Ok(tickets);
            }
            catch (Exception)
            {
                return BadRequest();
            }
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
                return Ok();
            }
            catch (HttpException)
            {
                return BadRequest();
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

            try
            {
                await _ticketService.PurchaseTicketsAsync(tickets, userId);
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
        /// <param name="seatId"></param>
        [HttpPost]
        [Route("reserveseat/{ticketId}/{seatId}")]
        public async Task<ActionResult> ReserveSeatAsync(int ticketId, int seatId)
        {

            try
            {
                await _ticketService.ReserveSeatAsync(ticketId, seatId);
                return Ok();
            }
            catch (Exception e)
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

            catch (HttpException)
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
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok(ticketVm);
        }
    }
}
