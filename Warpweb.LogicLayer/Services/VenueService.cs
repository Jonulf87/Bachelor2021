﻿using System;
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
                    VenueId = a.VenueId,
                    VenueName = a.VenueName
                }).ToListAsync();
        }

        public async Task<VenueVm> GetVenueAsync(int id)
        {
            return await _dbContext.Venues
                .Where(a => a.VenueId == id)
                .Select(a => new VenueVm
                {
                    VenueId = a.VenueId,
                    VenueName = a.VenueName,
                    VenueAddress = a.VenueAddress,
                    VenueAreaAvailable = a.VenueAreaAvailable,
                    VenueCapacity = a.VenueCapacity,
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues
                .Where(a => a.VenueId == venueVm.VenueId || a.VenueName == venueVm.VenueName)
                .FirstOrDefault();

            if (existingVenue != null)
            {
                throw new VenueAlreadyExistsException();
            }

            var venue = new Venue
            {
                VenueId = venueVm.VenueId,
                VenueName = venueVm.VenueName,
                VenueAddress = venueVm.VenueAddress,
                VenueAreaAvailable = venueVm.VenueAreaAvailable,
                VenueCapacity = venueVm.VenueCapacity
            };

            _dbContext.Venues.Add(venue);
            await _dbContext.SaveChangesAsync();

            return venue.VenueId;
        }

        public async Task<int> UpdateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues.Where(a => a.VenueId == venueVm.VenueId).FirstOrDefault();

            if (existingVenue == null)
            {
                throw new NotImplementedException();
            }

            existingVenue.VenueId = venueVm.VenueId;
            existingVenue.VenueName = venueVm.VenueName;
            existingVenue.VenueAddress = venueVm.VenueAddress;
            existingVenue.VenueAreaAvailable = venueVm.VenueAreaAvailable;
            existingVenue.VenueCapacity = venueVm.VenueCapacity;

            _dbContext.Update<Venue>(existingVenue);
            await _dbContext.SaveChangesAsync();

            return existingVenue.VenueId;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteVenueAsync(VenueVm venueVm)
        {

            var venueToBeDeleted = _dbContext.Venues.Where(a => a.VenueId == venueVm.VenueId).FirstOrDefault();

            if (venueToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<Venue>(venueToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return venueToBeDeleted.VenueId;

        }
    }
}
