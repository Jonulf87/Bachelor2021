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
                    MainEventName = a.MainEvent.Name,
                    Price = a.Price,
                    SeatNumber = a.Seat.SeatNumber,
                    TicketType = a.Type.DescriptionName,
                    UserId = a.User.Id
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

        public async Task<List<TicketListVm>> GetAllTicketsUserEventAsync(string userId, int eventId)
        {
            return await _dbContext.Tickets
                .Where(a => a.MainEventId == eventId && a.User.Id == userId)
                .IgnoreQueryFilters()
                .Select(a => new TicketListVm
                {
                    Id = a.Id,
                    MainEventName = a.MainEvent.Name,
                    Price = a.Price,
                    RowName = a.Seat.Row.Name,
                    SeatNumber = a.Seat.SeatNumber,
                    TicketType = a.Type.DescriptionName,
                    UserId = userId
                }).ToListAsync();
        }

        public async Task<List<TicketListVm>> GetAllTicketsUserEventUnpaidAsync(string userId, int eventId)
        {
            return await _dbContext.Tickets
                .Where(a => a.MainEventId == eventId && a.User.Id == userId && !a.IsPaid)
                .IgnoreQueryFilters()
                .Select(a => new TicketListVm
                {
                    Id = a.Id,
                    MainEventName = a.MainEvent.Name,
                    Price = a.Price,
                    RowName = a.Seat.Row.Name,
                    SeatNumber = a.Seat.SeatNumber,
                    TicketType = a.Type.DescriptionName,
                    UserId = userId
                }).ToListAsync();
        }

        public async Task CreateTicketAsync(List<TicketTypeListVm> ticketList, string userId)
        {
            var user = await _dbContext.ApplicationUsers
                .Include(a => a.Guardian)
                .SingleOrDefaultAsync(a => a.Id == userId);

            if (user.DateOfBirth > DateTime.Now.AddYears(-16) && user.Guardian?.EMail == null && user.Guardian?.PhoneNumber == null)
            {
                throw new NoGuardianSetForMinorException();
            }
            foreach (var ticketIn in ticketList)
            {
                var ticketCount = await _dbContext.Tickets
                    .Where(a => a.TicketTypeId == ticketIn.Id)
                    .CountAsync();
                var ticketType = await _dbContext.TicketTypes
                    .Where(a => a.Id == ticketIn.Id)
                    .IgnoreQueryFilters()
                    .SingleOrDefaultAsync();

                if (ticketCount >= ticketType.AmountAvailable + 5)
                {
                    throw new TicketTypeSoldOutException();
                }

                List<Ticket> tickets = new();

                for (int i = 0; i < ticketIn.AmountToBuy; i++)
                {
                    tickets.Add(
                        new Ticket
                        {
                            MainEventId = ticketType.MainEventId,
                            Price = ticketType.BasePrice,
                            TicketTypeId = ticketType.Id,
                            ApplicationUserId = userId
                        }
                    );
                }

                _dbContext.Tickets.AddRange(tickets);

            }

            await _dbContext.SaveChangesAsync();
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

            if (seat == null)
            {
                throw new ItemNotFoundException($"Fant ingen seter med setenr: {seat.SeatNumber}");
            }

            if (seat.Row.TicketTypes.All(a => a.Id != ticket.TicketTypeId))
            {
                throw new NoAccessToSeatClassException();
            }

            if (seat.IsReserved)
            {
                throw new SeatAlreadyReservedException();
            }

            if (!ticket.IsPaid)
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
