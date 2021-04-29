using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class ReportsService
    {
        private readonly ApplicationDbContext _dbContext;

        public ReportsService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GendersReportVm> GetGendersReportAsync()
        {
            var girls = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Jente")
                .CountAsync();

            var boys = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Gutt")
                .CountAsync();

            var other = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Annet")
                .CountAsync();

            var notDisclosed = await _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Vil ikke oppgi")
                .CountAsync();

            return new GendersReportVm
            {
                FemaleAmount = girls,
                MaleAmount = boys,
                NotDisclosedAmount = notDisclosed,
                OtherAmount = other
            };
        }

        public async Task<List<AllergyReportListVm>> GetAllergiesReportAsync()
        {

            return await _dbContext.ApplicationUsers
                .Where(a => a.AllergyDescription != null)
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
    }
}
