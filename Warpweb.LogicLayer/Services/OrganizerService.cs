using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class OrganizerService
    {
        private readonly ApplicationDbContext _dbContext;

        public OrganizerService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public async Task<List<OrganizerListVm>> GetOrganizersAsync()
        {
            return await _dbContext.Organizers
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
                })
                .ToListAsync();
        }

        public async Task<OrganizerVm> GetOrganizerAsync(int id)
        {
            return await _dbContext.Organizers
                .Where(a => a.Id == id)
                .Select(a => new OrganizerVm 
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
                })
                .SingleOrDefaultAsync();
        }

        public async Task<int> CreateOrganizerAsync(OrganizerVm organizerVm)
        {
            var existingOrganizer = _dbContext.Organizers
                .Where(a => a.Id == organizerVm.Id || a.Name == organizerVm.Name)
                .FirstOrDefault();

            if(existingOrganizer != null)
            {
                throw new NotImplementedException(); 
            }

            var organizer = new Organizer
            {
                Name = organizerVm.Name,
                Description = organizerVm.Description,
                ContactId = organizerVm.ContactId,
                OrgNumber = organizerVm.OrgNumber
            };

            _dbContext.Organizers.Add(organizer);
            await _dbContext.SaveChangesAsync();

            return organizer.Id;
        }

        public async Task<int> UpdateOrganizerAsync(OrganizerVm organizerVm)
        {
            
            var existingOrganizer = _dbContext.Organizers.Where(a => a.Id == organizerVm.Id).FirstOrDefault();

            if(existingOrganizer == null)
            {
                throw new NotImplementedException();
            }

            existingOrganizer.Id = organizerVm.Id;
            existingOrganizer.Name = organizerVm.Name;
            existingOrganizer.OrgNumber = organizerVm.OrgNumber;
            existingOrganizer.Description = organizerVm.Description;
            existingOrganizer.ContactId = organizerVm.ContactId;

            _dbContext.Update<Organizer>(existingOrganizer);
            await _dbContext.SaveChangesAsync();

            return existingOrganizer.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteOrganizerAsync(OrganizerVm organizerVm)
        {

            var organizerToBeDeleted = _dbContext.Organizers.Where(a => a.Id == organizerVm.Id).FirstOrDefault();

            if (organizerToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<Organizer>(organizerToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return organizerToBeDeleted.Id;

        }
    }
}
