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
    public class TicketTypeService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public TicketTypeService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            this._dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

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

        public async Task<List<TicketTypeListVm>> GetTicketTypesForEventAsync(int eventId)
        {
            return await _dbContext.TicketTypes
                .Where(a => a.MainEventId == eventId)
                .IgnoreQueryFilters()
                .Select(a => new TicketTypeListVm
                {
                    AmountAvailable = a.AmountAvailable,
                    BasePrice = a.BasePrice,
                    DescriptionName = a.DescriptionName,
                    Id = a.Id,
                    AmountToBuy = 0
                })
                .ToListAsync();
        }

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

        public async Task CreateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes
                .Where(a => a.DescriptionName == ticketTypeVm.DescriptionName)
                .SingleOrDefault();

            if (existingTicketType != null)
            {
                throw new ItemAlreadyExistsException($"Billettypen {ticketTypeVm.DescriptionName} eksisterer allerede");
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

        public async Task UpdateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes.Find(ticketTypeVm.Id); 

            if (existingTicketType == null) 
            {
                throw new ItemNotFoundException($"Fant ingen billettyper med navnet: {ticketTypeVm.DescriptionName}");
            }

            existingTicketType.AmountAvailable = ticketTypeVm.AmountAvailable; 
            existingTicketType.BasePrice = ticketTypeVm.BasePrice;
            existingTicketType.DescriptionName = ticketTypeVm.DescriptionName;

            _dbContext.Update(existingTicketType);
            await _dbContext.SaveChangesAsync(); 
        }


        public async Task DeleteTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {

            var ticketTypeToBeDeleted = _dbContext.TicketTypes.Where(a => a.Id == ticketTypeVm.Id).SingleOrDefault();

            if (ticketTypeToBeDeleted == null)
            {
                throw new ItemNotFoundException($"Fant ingen billettyper med navnet: {ticketTypeVm.DescriptionName}");
            }

            _dbContext.Remove<TicketType>(ticketTypeToBeDeleted);
            await _dbContext.SaveChangesAsync();


        }
    }
}
