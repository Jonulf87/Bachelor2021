﻿using System;
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
            var girls = _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Jente")
                .Count();

            var boys = _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Gutt")
                .Count();

            var other = _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Annet")
                .Count();

            var notDisclosed = _dbContext.ApplicationUsers
                .Where(a => a.Gender == "Vil ikke oppgi")
                .Count();

            return new GendersReportVm
            {
                FemaleAmount = girls,
                MaleAmount = boys,
                NotDisclosedAmount = notDisclosed,
                OtherAmount = other
            };
        }
    }
}
