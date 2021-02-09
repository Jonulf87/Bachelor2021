﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class SecurityService
    {
        private readonly ApplicationDbContext _dbContext;

        public SecurityService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<OrganizerListVm>> GetOrganizersAsync(string name)
        {
            return await _dbContext.Organizers
                .Where(a => a.Contact.FirstName == name)
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
                }).ToListAsync();

        }
    }
}