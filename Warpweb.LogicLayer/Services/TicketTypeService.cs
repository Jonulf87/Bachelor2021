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
    public class TicketTypeService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public TicketTypeService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            this._dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        /// <summary>
        /// Returns all available ticket types for active event
        /// </summary>
        public async Task<List<TicketTypeListVm>> GetTicketTypesAsync()
        {
            return await _dbContext.TicketTypes
                .Select(a => new TicketTypeListVm
                {
                    Id = a.Id,
                    DescriptionName = a.DescriptionName,
                    AmountAvailable = a.AmountAvailable,
                    BasePrice = a.BasePrice
                }).ToListAsync();
        }

        /// <summary>
        /// Returns all ticket types
        /// </summary>
        /// <param name="eventId"></param>  
        public async Task<List<TicketTypeListVm>> GetTicketTypesForEventAsync(int eventId)
        {
            var ticketTypesForEvent = await _dbContext.TicketTypes
                .Where(a => a.MainEventId == eventId)
                .IgnoreQueryFilters()
                .ToListAsync();

            List<TicketTypeListVm> ticketTypesListToSend = new();

            foreach (var ticketType in ticketTypesForEvent)
            {
                var amountSold = await _dbContext.Tickets
                    .Where(a => a.Type == ticketType)
                    .IgnoreQueryFilters()
                    .CountAsync();

                ticketTypesListToSend.Add(new TicketTypeListVm
                {
                    AmountAvailable = ticketType.AmountAvailable - amountSold,
                    BasePrice = ticketType.BasePrice,
                    AmountToBuy = 0,
                    DescriptionName = ticketType.DescriptionName,
                    Id = ticketType.Id
                });
            }
            return ticketTypesListToSend;
        }

        /// <summary>
        /// Return specific ticket type
        /// </summary>
        /// <param name="id"></param>  
        public async Task<TicketTypeVm> GetTicketTypeAsync(int id)
        {
            return await _dbContext.TicketTypes
                .Where(a => a.Id == id)
                .Select(a => new TicketTypeVm
                {
                    Id = a.Id,
                    DescriptionName = a.DescriptionName,
                    AmountAvailable = a.AmountAvailable,
                    BasePrice = a.BasePrice
                }).SingleOrDefaultAsync();
        }

        /// <summary>
        /// Create ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        public async Task CreateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes
                .Where(a => a.DescriptionName == ticketTypeVm.DescriptionName)
                .SingleOrDefault();

            if (existingTicketType != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Billettypen {ticketTypeVm.DescriptionName} eksisterer allerede");
            }

            var newTicketType = new TicketType
            {
                DescriptionName = ticketTypeVm.DescriptionName,
                AmountAvailable = ticketTypeVm.AmountAvailable,
                BasePrice = ticketTypeVm.BasePrice,
                MainEventId = _mainEventProvider.MainEventId
            };

            _dbContext.TicketTypes.Add(newTicketType);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Modify ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        public async Task UpdateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes.Find(ticketTypeVm.Id); 

            if (existingTicketType == null) 
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen billettyper med navnet: {ticketTypeVm.DescriptionName}");
            }

            existingTicketType.AmountAvailable = ticketTypeVm.AmountAvailable; 
            existingTicketType.BasePrice = ticketTypeVm.BasePrice;
            existingTicketType.DescriptionName = ticketTypeVm.DescriptionName;

            _dbContext.Update(existingTicketType);
            await _dbContext.SaveChangesAsync(); 
        }

        /// <summary>
        /// Deletes ticket type
        /// </summary>
        /// <param name="ticketTypeVm"></param> 
        public async Task DeleteTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {

            var ticketTypeToBeDeleted = _dbContext.TicketTypes.Where(a => a.Id == ticketTypeVm.Id).SingleOrDefault();

            if (ticketTypeToBeDeleted == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen billettyper med navnet: {ticketTypeVm.DescriptionName}");
            }

            _dbContext.Remove<TicketType>(ticketTypeToBeDeleted);
            await _dbContext.SaveChangesAsync();


        }
    }
}
