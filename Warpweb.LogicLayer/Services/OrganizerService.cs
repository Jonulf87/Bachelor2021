using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class OrganizerService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrganizerService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<List<OrganizerListVm>> GetOrganizersAsync()
        {
            return await _dbContext.Organizers
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber,
                    Description = a.Description
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
                    OrgNumber = a.OrgNumber,
                    Description = a.Description,
                    ContactName = a.ContactId
                })
                .SingleOrDefaultAsync();
        }

        public async Task<int> CreateOrganizerAsync(OrganizerVm organizerVm)
        {
            var existingOrganizer = _dbContext.Organizers
                .Where(a => a.Id == organizerVm.Id || a.Name == organizerVm.Name)
                .FirstOrDefault();

            if (existingOrganizer != null)
            {
                throw new NotImplementedException();
            }

            var organizer = new Organizer
            {
                Name = organizerVm.Name,
                Description = organizerVm.Description,
                ContactId = organizerVm.ContactName,
                OrgNumber = organizerVm.OrgNumber
            };

            _dbContext.Organizers.Add(organizer);
            await _dbContext.SaveChangesAsync();

            return organizer.Id;
        }

        public async Task<int> UpdateOrganizerAsync(OrganizerVm organizerVm)
        {

            var existingOrganizer = _dbContext.Organizers.Where(a => a.Id == organizerVm.Id).FirstOrDefault();

            if (existingOrganizer == null)
            {
                throw new NotImplementedException();
            }

            existingOrganizer.Id = organizerVm.Id;
            existingOrganizer.Name = organizerVm.Name;
            existingOrganizer.OrgNumber = organizerVm.OrgNumber;
            existingOrganizer.Description = organizerVm.Description;
            existingOrganizer.ContactId = organizerVm.ContactName;

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

        public async Task<OrganizerVm> GetOrganizerContactAsync(int orgId)
        {
            var contact = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .Select(a => new OrganizerVm
                {
                    Name = a.Name,
                    OrgNumber = a.OrgNumber,
                    Description = a.Description,
                    ContactName = a.Contact.FirstName + " " + a.Contact.LastName,
                    ContactPhone = a.Contact.PhoneNumber,
                    ContactMail = a.Contact.Email
                }).FirstOrDefaultAsync();

            return contact;
        }

        public async Task<List<OrgAdminVm>> GetOrgAdminsAsync(int orgId)
        {
            var organizer = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .Include(a => a.Admins)
                .SingleOrDefaultAsync();

            if (organizer != null)
            {
                var admins = organizer.Admins
                    .Select(a => new OrgAdminVm
                    {
                        Name = a.FirstName + " " + a.LastName,
                        EMail = a.Email,
                        Id = a.Id,
                        PhoneNumber = a.PhoneNumber
                    }).ToList();

                return admins;
            }

            return null;
        }

        public async Task SetOrgAdminAsync(int orgId, string userId)
        {
            var existingOrg = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .Include(a => a.Admins)
                .SingleOrDefaultAsync();

            var userToBeAdmin = await _userManager.FindByIdAsync(userId);

            existingOrg.Admins.Add(userToBeAdmin);
            await _dbContext.SaveChangesAsync();
        }
    }
}
