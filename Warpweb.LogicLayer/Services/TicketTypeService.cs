using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class TicketTypeService
    {
        private readonly ApplicationDbContext _dbContext;

        public TicketTypeService(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
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
                }).FirstOrDefaultAsync();
        }

        public async Task<int> CreateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes
                .Where(a => a.DescriptionName == ticketTypeVm.DescriptionName)
                .FirstOrDefault();

            if (existingTicketType != null)
            {
                throw new TicketTypeAlreadyExistsException();
            }

            var newTicketType = new TicketType
            {
                DescriptionName = ticketTypeVm.DescriptionName,
                AmountAvailable = ticketTypeVm.AmountAvailable,
                BasePrice = ticketTypeVm.BasePrice
            };

            _dbContext.TicketTypes.Add(newTicketType);
            await _dbContext.SaveChangesAsync();

            return newTicketType.Id;
        }

        public async Task<int> UpdateTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {
            var existingTicketType = _dbContext.TicketTypes.Find(ticketTypeVm.Id); //Henter eksisterende fra db

            if (existingTicketType == null) //Dobbelsjekk at den faktisk eksisterer i db
            {
                throw new TicketTypeDoesNotExistException();
            }

            existingTicketType.AmountAvailable = ticketTypeVm.AmountAvailable; //Nye props i objektet som skal sendes til db
            existingTicketType.BasePrice = ticketTypeVm.BasePrice;
            existingTicketType.DescriptionName = ticketTypeVm.DescriptionName;

            _dbContext.Update(existingTicketType);
            await _dbContext.SaveChangesAsync(); //Setter inn modell med nye props

            return existingTicketType.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteTicketTypeAsync(TicketTypeVm ticketTypeVm)
        {

            var ticketTypeToBeDeleted = _dbContext.TicketTypes.Where(a => a.Id == ticketTypeVm.Id).FirstOrDefault();

            if (ticketTypeToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<TicketType>(ticketTypeToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return ticketTypeToBeDeleted.Id;

        }
    }
}
