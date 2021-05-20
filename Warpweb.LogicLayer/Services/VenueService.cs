using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{

    public class VenueService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public VenueService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        /// <summary>
        /// Returns all Venues.
        /// </summary>
        /// <returns>List of Venues</returns>
        public async Task<List<VenueListVm>> GetVenuesAsync()
        {
            var venuesList = await _dbContext.Venues
                .Select(a => new VenueListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Address = a.Address

                }).ToListAsync();

            if(venuesList == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ingen lokaler");
            }
            return venuesList;
        }

        /// <summary>
        /// Returns only Venues under Tenant
        /// </summary>
        /// <returns>VenueListVm</returns>
        public async Task<List<VenueListVm>> GetOrganizerVenuesAsync()
        {
            var orgId = await _dbContext.MainEvents
                .Where(a => a.Id == _mainEventProvider.MainEventId)
                .Select(a => a.OrganizerId)
                .SingleAsync();
            System.Diagnostics.Debug.WriteLine("###########################");
            System.Diagnostics.Debug.WriteLine(_mainEventProvider.MainEventId);
            System.Diagnostics.Debug.WriteLine("###########################");

            var organizerVenuesList = await _dbContext.Venues
                .Where(a => a.OrganizerId == orgId)
                .Select(a => new VenueListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Address = a.Address
                }).ToListAsync();

            return organizerVenuesList;
        }

        /// <summary>
        /// Returns a specific Venue.
        /// </summary>
        /// <param name="venueId"></param>
        /// <returns>VenueVm</returns>
        public async Task<VenueVm> GetVenueAsync(int id)
        {

           if(id <= 0)
           {
                throw new HttpException(HttpStatusCode.BadRequest, "Ugyldig Id");
           }

           var venue = await _dbContext.Venues
                .Where(a => a.Id == id)
                .Select(a => new VenueVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    Address = a.Address,
                    ContactEMail = a.ContactEMail,
                    ContactName = a.ContactName,
                    ContactPhone = a.ContactPhone,
                    OrganizerId = a.OrganizerId,
                    PostalCode = a.PostalCode

                }).SingleOrDefaultAsync();

            if (venue == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke lokalet");
            }

            return venue;
        }

        /// <summary>
        /// Create a Venue.
        /// </summary>
        /// <param name="venueVm"></param>
        /// <returns>VenueVm</returns>
        public async Task CreateVenueAsync(VenueVm venueVm)
        {

            var existingVenue = await _dbContext.Venues.Where(a => a.Name == venueVm.Name && a.OrganizerId == venueVm.OrganizerId).SingleOrDefaultAsync();

            if (existingVenue != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Lokalet med navn: {venueVm.Name} eksisterer allerede");
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
        }

        /// <summary>
        /// Update specific venue
        /// </summary>
        /// <param name="venueVm"></param>  
        public async Task UpdateVenueAsync(VenueVm venueVm)
        {
            var existingVenue = _dbContext.Venues.Where(a => a.Id == venueVm.Id).SingleOrDefault();

            if (existingVenue == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen lokaler med navn: {venueVm.Name}");
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
        }
    }
}
