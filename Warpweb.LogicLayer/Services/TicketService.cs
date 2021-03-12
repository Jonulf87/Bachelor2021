using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class TicketService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public TicketService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        public async Task<List<TicketListVm>> GetTicketsAsync()
        {
            return await _dbContext.Tickets
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .Select(a => new TicketListVm
                {
                    Id = a.Id,
                    MainEvent = a.MainEvent,
                    Price = a.Price,
                    Seat = a.Seat,
                    Type = a.Type,
                    User = a.User
                }).ToListAsync();
        }

        public async Task<TicketVm> GetTicketAsync(int id)
        {
            return await _dbContext.Tickets
                .Where(a => a.Id == id && a.MainEventId == _mainEventProvider.MainEventId)
                .Select(a => new TicketVm
                {
                    Id = a.Id,
                    MainEvent = a.MainEvent,
                    Price = a.Price,
                    Seat = a.Seat,
                    Type = a.Type,
                    User = a.User
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateTicketAsync(TicketVm ticketVm)
        {
            var existingTicket = _dbContext.Tickets
                .Where(a => (a.Id == ticketVm.Id || a.Seat == ticketVm.Seat) && a.MainEventId == _mainEventProvider.MainEventId)
                .FirstOrDefault();

            if (existingTicket != null)
            {
                throw new TicketAlreadyExistsException();
            }

            var ticket = new Ticket
            {
                Id = ticketVm.Id,
                Seat = ticketVm.Seat,
                MainEvent = ticketVm.MainEvent,
                Price = ticketVm.Price,
                Type = ticketVm.Type,
                User = ticketVm.User
            };

            _dbContext.Tickets.Add(ticket);
            await _dbContext.SaveChangesAsync();

            return ticket.Id;      
        }
        public async Task<int> UpdateTicketAsync(TicketVm ticketVm)
        {

            var existingTicket = _dbContext.Tickets.Where(a => a.Id == ticketVm.Id && a.MainEventId == _mainEventProvider.MainEventId).FirstOrDefault();

            if (existingTicket == null)
            {
                throw new NotImplementedException();
            }

            existingTicket.Id = ticketVm.Id;
            existingTicket.Seat = ticketVm.Seat;
            existingTicket.MainEvent = ticketVm.MainEvent;
            existingTicket.Price = ticketVm.Price;
            existingTicket.Type = ticketVm.Type;
            existingTicket.User = ticketVm.User;

            _dbContext.Update<Ticket>(existingTicket);
            await _dbContext.SaveChangesAsync();

            return existingTicket.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteTicketAsync(TicketVm ticketVm)
        {

            var ticketToBeDeleted = _dbContext.Tickets.Where(a => a.Id == ticketVm.Id && a.MainEventId == _mainEventProvider.MainEventId).FirstOrDefault();

            if (ticketToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<Ticket>(ticketToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return ticketToBeDeleted.Id;

        }
    }
}
