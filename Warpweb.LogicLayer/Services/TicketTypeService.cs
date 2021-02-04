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

            var ticketType = new TicketType
            {
                Id = ticketTypeVm.Id,
                DescriptionName = ticketTypeVm.DescriptionName,
                BasePrice = ticketTypeVm.BasePrice,
                AmountAvailable = ticketTypeVm.AmountAvailable
            };

            _dbContext.TicketTypes.Add(ticketType);
            await _dbContext.SaveChangesAsync();

            return ticketType.Id;
        }
    }
}
