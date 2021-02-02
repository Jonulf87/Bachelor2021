﻿using System;
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
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<List<TicketListVm>> GetTickets()
        {
            return await _ticketService.GetTicketsAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketVm>> GetTicket(int id)
        {
            return await _ticketService.GetTicketAsync(id);
        }

        [HttpPost]
        [Authorize(Roles = "Users")]
        public async Task<ActionResult<TicketVm>> CreateTicket(TicketVm ticketVm)
        {

            try
            {
                await _ticketService.CreateTicketAsync(ticketVm);
            }
            catch (TicketAlreadyExistException)
            {
                return BadRequest(); 
            }

            return Ok(ticketVm);
        }

    }
}
