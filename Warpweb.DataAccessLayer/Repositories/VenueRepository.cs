using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.DataAccessLayer.Repositories
{
    public class VenueRepository : IVenueRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<VenueRepository> _log;

        public VenueRepository(ApplicationDbContext db, ILogger<VenueRepository> log)
        {
            _db = db;
            _log = log;
        }

        public Task<bool> CreateVenue(Venue inVenue)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteVenue(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Venue> GetVenue(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Venue>> GetVenues()
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateVenue(Venue modifyVenue)
        {
            throw new NotImplementedException();
        }
    }
}
