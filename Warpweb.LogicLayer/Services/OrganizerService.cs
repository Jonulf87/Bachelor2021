using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
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

        /// <summary>
        /// Returns all tentants/organizers
        /// </summary>
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

        /// <summary>
        /// Return specific tentant/organizer
        /// </summary>
        /// <param name="orgId"></param> 
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

        /// <summary>
        /// Create tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
        public async Task CreateOrganizerAsync(OrganizerVm organizerVm)
        {
            var existingOrganizer = _dbContext.Organizers
                .Where(a => a.Id == organizerVm.Id || a.Name == organizerVm.Name)
                .FirstOrDefault();

            if (existingOrganizer != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Arrangøren: {existingOrganizer.Name} eksisterer allerede");
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
        }

        /// <summary>
        /// Create tenant/organizer
        /// </summary>
        /// <param name="organizerVm"></param> 
        public async Task UpdateOrganizerAsync(OrganizerVm organizerVm)
        {

            var existingOrganizer = _dbContext.Organizers.Where(a => a.Id == organizerVm.Id).FirstOrDefault();

            if (existingOrganizer == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke arrangøren");
            }

            existingOrganizer.Id = organizerVm.Id;
            existingOrganizer.Name = organizerVm.Name;
            existingOrganizer.OrgNumber = organizerVm.OrgNumber;
            existingOrganizer.Description = organizerVm.Description;
            existingOrganizer.ContactId = organizerVm.ContactName;

            _dbContext.Update<Organizer>(existingOrganizer);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Returns active contact person for organization
        /// </summary>
        /// <param name="orgId"></param> 
        public async Task<List<OrganizerVm>> GetOrganizerContactAsync(int orgId)
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
                }).ToListAsync();

            return contact;
        }

        /// <summary>
        /// Sets contact person for organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
        public async Task<OrganizerVm> SetOrganizerContactAsync(int orgId, string userId)
        {
            var organizer = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .SingleOrDefaultAsync();

            organizer.ContactId = userId;

            await _dbContext.SaveChangesAsync();

            var organizerToBeSent = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .Select(a => new OrganizerVm
                {
                    Id = a.Id,
                    ContactMail = a.Contact.Email,
                    ContactName = a.Contact.FirstName + " " + a.Contact.LastName,
                    ContactPhone = a.Contact.PhoneNumber,
                    Description = a.Description,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber

                }).SingleOrDefaultAsync();


            return organizerToBeSent;
        }

        /// <summary>
        /// Returns organizations where the user is administraor
        /// </summary>
        /// <param name="userId"></param> 
        public async Task<List<OrganizerListVm>> GetOrgsWhereUserIsAdminAsync(string userId)
        {
            return await _dbContext.Organizers
                .Where(a => a.Admins.Any(b => b.Id == userId))
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    OrgNumber = a.OrgNumber
                }).ToListAsync();
        }

        /// <summary>
        /// Remove organization administrator
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param>
        public async Task RemoveOrgAdminAsync(int orgId, string userId)
        {
            var user = _dbContext.ApplicationUsers.Find(userId);

            if(user == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke brukeren");
            }

            var existingOrgAdmin = await _dbContext.Organizers
                .Where(a => a.Id == orgId)
                .Include(a => a.Admins)
                .SingleOrDefaultAsync(a => a.Admins.Contains(user));

            if(existingOrgAdmin == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke arrangøren");
            }
            existingOrgAdmin.Admins.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Returns organization administrators
        /// </summary>
        /// <param name="orgId"></param> 
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

        /// <summary>
        /// Add organization administrator
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="userId"></param> 
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
