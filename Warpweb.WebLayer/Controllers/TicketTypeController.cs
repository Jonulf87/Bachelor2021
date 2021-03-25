﻿using System;
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
        public async Task<List<TicketTypeListVm>> GetTicketTypes()
        {
            return await _ticketTypeService.GetTicketTypesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketTypeVm>> GetTicketType(int id)
        {
            return await _ticketTypeService.GetTicketTypeAsync(id);
        }

        [HttpPost]
        [Route("createTicketType")]
        //[Authorize(Roles = "Admins")]
        public async Task<ActionResult> CreateTicketType(TicketTypeVm ticketTypeVm)
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

        [HttpPut]
        public async Task<ActionResult> UpdateTicketType(TicketTypeVm ticketTypeVm)
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

        // TODO: Restrict to SuperAdmin
        [HttpDelete]
        public async Task<ActionResult> DeleteTicketType(TicketTypeVm ticketTypeVm)
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
