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

        public async Task<List<VenueListVm>> GetVenuesAsync()
        {
            return await _dbContext.Venues
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .Select(a => new VenueListVm
                {
                    VenueId = a.Id,
                    VenueName = a.Name
                }).ToListAsync();
        }

        public async Task<VenueVm> GetVenueAsync(int id)
        {
            return await _dbContext.Venues
                .Where(a => a.Id == id)
                .Select(a => new VenueVm
                {
                    VenueId = a.Id,
                    VenueName = a.Name,
                    VenueAddress = a.Address,
                    VenueAreaAvailable = a.AreaAvailable,
                    VenueCapacity = a.Capacity,
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues
                .Where(a => a.Id == venueVm.VenueId || a.Name == venueVm.VenueName)
                .FirstOrDefault();

            if (existingVenue != null)
            {
                throw new VenueAlreadyExistsException();
            }

            var venue = new Venue
            {
                Id = venueVm.VenueId,
                Name = venueVm.VenueName,
                Address = venueVm.VenueAddress,
                AreaAvailable = venueVm.VenueAreaAvailable,
                Capacity = venueVm.VenueCapacity
            };

            _dbContext.Venues.Add(venue);
            await _dbContext.SaveChangesAsync();

            return venue.Id;
        }

        public async Task<int> UpdateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues.Where(a => a.Id == venueVm.VenueId).FirstOrDefault();

            if (existingVenue == null)
            {
                throw new NotImplementedException();
            }

            existingVenue.Id = venueVm.VenueId;
            existingVenue.Name = venueVm.VenueName;
            existingVenue.Address = venueVm.VenueAddress;
            existingVenue.AreaAvailable = venueVm.VenueAreaAvailable;
            existingVenue.Capacity = venueVm.VenueCapacity;

            _dbContext.Update<Venue>(existingVenue);
            await _dbContext.SaveChangesAsync();

            return existingVenue.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteVenueAsync(VenueVm venueVm)
        {

            var venueToBeDeleted = _dbContext.Venues.Where(a => a.Id == venueVm.VenueId).FirstOrDefault();

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
