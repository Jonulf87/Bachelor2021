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
                    Price = a.Price,
                }).SingleOrDefaultAsync();
        }

        public async Task<TicketVm> CreateTicketAsync(int ticketTypeId, string userId)
        {

            var ticketCount = await _dbContext.Tickets
                .Where(a => a.TicketTypeId == ticketTypeId)
                .CountAsync();
            var ticketType = await _dbContext.TicketTypes
                .Where(a => a.Id == ticketTypeId)
                .SingleOrDefaultAsync();
            var user = await _dbContext.ApplicationUsers
                .FindAsync(userId);

            if (ticketCount >= ticketType.AmountAvailable)
            {
                throw new TicketTypeSoldOutException();
            }

            if (user.DateOfBirth > DateTime.Now.AddYears(-16) && user?.Guardian.EMail == null && user?.Guardian.PhoneNumber == null)
            {
                throw new NoGuardianSetForMinorException();
            }

            var ticket = new Ticket
            {
                MainEventId = ticketType.MainEventId,
                Price = ticketType.BasePrice,
                TicketTypeId = ticketType.Id,
                ApplicationUserId = userId
            };

            _dbContext.Tickets.Add(ticket);
            await _dbContext.SaveChangesAsync();

            var ticketVm = new TicketVm
            {
                Id = ticket.Id,
                Price = ticket.Price,
                TicketTypeId = ticket.TicketTypeId
            };

            return ticketVm;      
        }

        public async Task PurchaseTicketAsync(int ticketId, string userId, int provider)
        {
            var ticket = await _dbContext.Tickets
                .Where(a => a.Id == ticketId && a.ApplicationUserId == userId)
                .SingleOrDefaultAsync();

            ticket.IsPaid = true;
            ticket.AmountPaid = ticket.Price;

            await _dbContext.SaveChangesAsync();
        }

        public async Task ReserveSeatAsync(int ticketId, int seatId, string userId)
        {
            var seat = await _dbContext.Seats
                .Include(a => a.Row)
                .Where(a => a.Id == seatId)
                .SingleOrDefaultAsync();

            var ticket = await _dbContext.Tickets
                .Where(a => a.Id == ticketId && a.ApplicationUserId == userId)
                .SingleOrDefaultAsync();

            if(seat == null)
            {
                throw new ItemNotFoundException($"Fant ingen seter med setenr: {seat.SeatNumber}");
            }
            
            if(seat.Row.TicketTypes.All(a => a.Id != ticket.TicketTypeId))
            {
                throw new NoAccessToSeatClassException();
            }

            if(seat.IsReserved)
            {
                throw new SeatAlreadyReservedException();
            }

            if(!ticket.IsPaid)
            {
                throw new TicketNotPaidException();
            }

            ticket.SeatId = seatId;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<int> UpdateTicketAsync(TicketVm ticketVm)
        {

            var existingTicket = _dbContext.Tickets.Where(a => a.Id == ticketVm.Id && a.MainEventId == _mainEventProvider.MainEventId).FirstOrDefault();

            if (existingTicket == null)
            {
                throw new NotImplementedException();
            }

            existingTicket.Id = ticketVm.Id;
            existingTicket.Price = ticketVm.Price;


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
