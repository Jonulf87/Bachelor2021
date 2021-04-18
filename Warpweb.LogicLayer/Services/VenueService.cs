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
    // Standard CRUD functionality for Venue class
    // Restrict removal of Venues to SuperAdmin/Admin?
    // TODO: Verify View Models for this service

    public class VenueService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public VenueService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        // Returner alle venues
        public async Task<List<VenueListVm>> GetVenuesAsync()
        {
            return await _dbContext.Venues
                .Select(a => new VenueListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Address = a.Address

                }).ToListAsync();
        }

        // Returner venues knyttet til arrangement
        public async Task<List<VenueListVm>> GetOrganizerVenuesAsync()
        {
            return await _dbContext.Venues
                .Where(a => a.MainEvents.Any(b => b.Id == _mainEventProvider.MainEventId))
                .Select(a => new VenueListVm
                {
                    Id = a.Id,
                    Name = a.Name
                }).ToListAsync();
        }

        public async Task<VenueVm> GetVenueAsync(int id)
        {
            return await _dbContext.Venues
                .Where(a => a.Id == id)
                .Select(a => new VenueVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Address = a.Address,
                    OrganizerId = a.OrganizerId,
                    PostalCode = a.PostalCode,
                    ContactName = a.ContactName,
                    ContactEMail = a.ContactEMail,
                    ContactPhone = a.ContactPhone
                    
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateVenueAsync(VenueVm venueVm)
        {

            var existingVenue = _dbContext.Venues.Where(a => a.Id == venueVm.Id).FirstOrDefault();

            if (existingVenue != null)
            {
                throw new ItemAlreadyExistsException($"Lokalet med navn: {venueVm.Name} eksisterer allerede");
            }

            var venue = new Venue
                {
                    Name = venueVm.Name,
                    Address = venueVm.Address,
                    PostalCode = venueVm.PostalCode,
                    OrganizerId = venueVm.OrganizerId,
                    ContactName = venueVm.ContactName,
                    ContactPhone = venueVm.ContactPhone,
                    ContactEMail = venueVm.ContactEMail
                };

                _dbContext.Venues.Add(venue);
                await _dbContext.SaveChangesAsync();

                return venue.Id;
        }

        public async Task<int> UpdateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues.Where(a => a.Id == venueVm.Id).FirstOrDefault();

            if (existingVenue == null)
            {
                throw new NotImplementedException();
            }

            existingVenue.Id = venueVm.Id;
            existingVenue.Name = venueVm.Name;
            existingVenue.Address = venueVm.Address;
            existingVenue.PostalCode = venueVm.PostalCode;
            existingVenue.OrganizerId = venueVm.OrganizerId;
            existingVenue.ContactName = venueVm.ContactName;
            existingVenue.ContactEMail = venueVm.ContactEMail;
            existingVenue.ContactPhone = venueVm.ContactPhone;

            _dbContext.Update<Venue>(existingVenue);
            await _dbContext.SaveChangesAsync();

            return existingVenue.Id;
        }

        public async Task<int> DeleteVenueAsync(VenueVm venueVm)
        {

            var venueToBeDeleted = _dbContext.Venues.Where(a => a.Id == venueVm.Id).FirstOrDefault();

            if (venueToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<Venue>(venueToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return venueToBeDeleted.Id;

        }
    }
}
