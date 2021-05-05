using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class ReportsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public ReportsService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        /// <summary>
        /// Returns count of different genders across participants for current event
        /// </summary>
        public async Task<GendersReportVm> GetGendersReportAsync()
        {
            var girls = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Jente" && a.CurrentMainEventId == _mainEventProvider.MainEventId)
                .CountAsync();

            var boys = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Gutt" && a.CurrentMainEventId == _mainEventProvider.MainEventId)
                .CountAsync();

            var other = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Annet" && a.CurrentMainEventId == _mainEventProvider.MainEventId)
                .CountAsync();

            var notDisclosed = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Vil ikke oppgi" && a.CurrentMainEventId == _mainEventProvider.MainEventId)
                .CountAsync();

            return new GendersReportVm
            {
                FemaleAmount = girls,
                MaleAmount = boys,
                NotDisclosedAmount = notDisclosed,
                OtherAmount = other
            };
        }

        /// <summary>
        /// Returns participants with allergies for current event
        /// </summary>
        public async Task<List<AllergyReportListVm>> GetAllergiesReportAsync()
        {

            return await _dbContext.ApplicationUsers
                .Where(a => a.AllergyDescription != null && a.CurrentMainEventId == _mainEventProvider.MainEventId)
                .OrderBy(a => a.FirstName)
                .ThenBy(a => a.LastName)
                .Select(a => new AllergyReportListVm
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email,
                    AllergyDescription = a.AllergyDescription,

                })
                .ToListAsync();
        }

        /// <summary>
        /// Returns sold ticket types for current event
        /// </summary>
        public async Task<List<TicketTypesReportListVm>> GetTicketTypesReportAsync()
        {
            var amountSoldTotal = await _dbContext.Tickets
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .CountAsync();

            return await _dbContext.TicketTypes
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .Select(a => new TicketTypesReportListVm
                {
                    AmountSold = amountSoldTotal,
                    AmountAvailable = a.AmountAvailable,
                    DescriptionName = a.DescriptionName
                })
                .ToListAsync();
        }
    }
}
