using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

        /// <summary>
        /// Return all tickets of event
        /// </summary>
        /// <returns>TicketListVM</returns>
        public async Task<List<TicketListVm>> GetTicketsAsync()
        {
            return await _dbContext.Tickets
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

        /// <summary>
        /// Returns all tickets of upcoming events belonging to user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<UserTicketsUpcomingVm>> GetAllUserTicketsUpcomingAsync(string userId)
        {
            return await _dbContext.Tickets
                .Where(a => a.MainEvent.StartDateTime > DateTime.Now && a.User.Id == userId)
                .Select(a => new UserTicketsUpcomingVm
                {
                    Id = a.Id,
                    Price = a.Price,
                    RowName = a.Seat.Row.Name,
                    SeatNumber = a.Seat.SeatNumber,
                    SeatId = a.SeatId,
                    TicketType = a.Type.DescriptionName,
                    TicketTypeId = a.TicketTypeId,
                    MainEventName = a.MainEvent.Name,
                    MainEventId = a.MainEventId,
                    Start = a.MainEvent.StartDateTime,
                    End = a.MainEvent.EndDateTime,
                    VenueName = a.MainEvent.Venue.Name,
                    UserFirstName = a.User.FirstName,
                    UserLastName = a.User.LastName
                }).ToListAsync();
        }

        /// <summary>
        /// Returns all tickets belonging to user independent of mainevent
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<TicketListVm>> GetAllTicketsOfUserAsync(string userId)
        {
            return await _dbContext.Tickets
                .Where(a => a.User.Id == userId)
                .IgnoreQueryFilters()
                .Select(a => new TicketListVm
                {
                    Id = a.Id,
                    MainEventName = a.MainEvent.Name,
                    Price = a.Price,
                    RowName = a.Seat.Row.Name,
                    SeatNumber = a.Seat.SeatNumber,
                    TicketType = a.Type.DescriptionName
                }).ToListAsync();
        }

        /// <summary>
        /// Return specific ticket
        /// </summary>
        /// <param name="id"></param>
        /// <returns>TicketVM</returns>
        public async Task<TicketVm> GetTicketAsync(int id)
        {
            return await _dbContext.Tickets
                .Where(a => a.Id == id)
                .Select(a => new TicketVm
                {
                    Id = a.Id,
                    Price = a.Price,
                }).SingleOrDefaultAsync();
        }

        /// <summary>
        /// Returns list of tickets held by current user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="eventId"></param>
        /// <returns>TicketVM</returns>
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

        /// <summary>
        /// Returns list of unpaid tickets held by current user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="eventId"></param>
        /// <returns>TicketVM</returns>
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

        /// <summary>
        /// Create new ticket
        /// </summary>
        /// <param name="tickets"></param>
        /// <param name="userId"></param>
        /// <returns>Ticket list</returns>
        public async Task<List<Ticket>> CreateTicketsAsync(List<TicketsToBuyVm> tickets, string userId)
        {
            var user = await _dbContext.ApplicationUsers
                .Include(a => a.Guardian)
                .SingleOrDefaultAsync(a => a.Id == userId);

            if (!tickets.Any())
            {
                throw new Exception();
            }

            if (user == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke brukeren");
            }

            if (user.DateOfBirth > DateTime.Now.AddYears(-16) && user.Guardian?.EMail == null && user.Guardian?.PhoneNumber == null)
            {
                throw new NoGuardianSetForMinorException();
            }

            List<Ticket> newTickets = new();

            foreach (var ticket in tickets)
            {
                var ticketCount = await _dbContext.Tickets
                    .Where(a => a.TicketTypeId == ticket.Id)
                    .CountAsync();
                var ticketType = await _dbContext.TicketTypes
                    .Where(a => a.Id == ticket.Id)
                    .IgnoreQueryFilters()
                    .SingleOrDefaultAsync();

                if (ticketCount >= ticketType.AmountAvailable)
                {
                    throw new TicketTypeSoldOutException();
                }
                if (ticketType == null)
                {
                    throw new HttpException(HttpStatusCode.NotFound, "Fant ikke billettypen");
                }

                newTickets.Add(
                    new Ticket
                    {
                        MainEventId = ticketType.MainEventId,
                        Price = ticketType.BasePrice,
                        TicketTypeId = ticketType.Id,
                        ApplicationUserId = userId
                    }
                );
            }
            _dbContext.Tickets.AddRange(newTickets);
            await _dbContext.SaveChangesAsync();

            return newTickets;
        }

        /// <summary>
        /// Simulates purchase of ticket
        /// </summary>
        /// <param name="tickets"></param>
        /// <param name="userId"></param>
        public async Task PurchaseTicketsAsync(List<TicketsToBuyVm> tickets, string userId)
        {

            var newTickets = await CreateTicketsAsync(tickets, userId);

            foreach (var ticket in newTickets)
            {
                ticket.IsPaid = true;
                ticket.AmountPaid = ticket.Price;
            }

            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Simulates reservation of seat in seatmap
        /// </summary>
        /// <param name="ticketId"></param>
        /// <param name="seatId"></param>
        public async Task ReserveSeatAsync(int ticketId, int seatId)
        {
            var seat = await _dbContext.Seats
                .Include(a => a.Row)
                .ThenInclude(a => a.TicketTypes)
                .IgnoreQueryFilters()
                .Where(a => a.Id == seatId)
                .SingleOrDefaultAsync();

            var ticket = await _dbContext.Tickets
                .Include(a => a.Seat)
                .Where(a => a.Id == ticketId)
                .SingleOrDefaultAsync();

            if (ticket.Seat?.IsReserved ?? false)
            {
                ticket.Seat.IsReserved = false;
            }

            if (seat == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen seter med setenr: {seat.SeatNumber}");
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
            seat.IsReserved = true;

            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Modify ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        public async Task<int> UpdateTicketAsync(TicketVm ticketVm)
        {

            var existingTicket = _dbContext.Tickets.Where(a => a.Id == ticketVm.Id && a.MainEventId == _mainEventProvider.MainEventId).FirstOrDefault();

            if (existingTicket == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke billetten");
            }

            existingTicket.Id = ticketVm.Id;
            existingTicket.Price = ticketVm.Price;


            _dbContext.Update<Ticket>(existingTicket);
            await _dbContext.SaveChangesAsync();

            return existingTicket.Id;
        }

        /// <summary>
        /// Delete ticket
        /// </summary>
        /// <param name="ticketVm"></param> 
        public async Task<int> DeleteTicketAsync(TicketVm ticketVm)
        {

            var ticketToBeDeleted = _dbContext.Tickets.Where(a => a.Id == ticketVm.Id && a.MainEventId == _mainEventProvider.MainEventId).FirstOrDefault();

            if (ticketToBeDeleted == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke billetten");
            }

            _dbContext.Remove<Ticket>(ticketToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return ticketToBeDeleted.Id;

        }
    }
}
