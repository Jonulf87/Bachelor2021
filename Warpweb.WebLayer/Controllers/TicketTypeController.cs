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
        [Authorize(Roles = "Admins")]
        public async Task<ActionResult<TicketTypeVm>> CreateTicketType(TicketTypeVm ticketTypeVm)
        {
            int ticketTypeId;
            try
            {
                ticketTypeId = await _ticketTypeService.CreateTicketTypeAsync(ticketTypeVm);
            }
            catch (TicketTypeAlreadyExistsException)
            {
                return BadRequest();
            }

            ticketTypeVm.Id = ticketTypeId;
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
