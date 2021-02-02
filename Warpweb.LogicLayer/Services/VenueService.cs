using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class VenueService
    {
        private readonly ApplicationDbContext _dbContext;

        public VenueService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<VenueListVm>> GetVenuesAsync()
        {
            return await _dbContext.Venues
                .Select(a => new VenueListVm
                {
                    VenueId = a.VenueId,
                    VenueAddress = a.VenueAddress,
                    VenueAreaAvailable = a.VenueAreaAvailable,
                    VenueCapacity = a.VenueCapacity
                }).ToListAsync();
        }

        public async Task<VenueVm> GetVenueAsync(int id)
        {
            return await _dbContext.Venues
                .Where(a => a.VenueId == id)
                .Select(a => new VenueVm
                {
                    VenueId = a.VenueId,
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
    }
}
