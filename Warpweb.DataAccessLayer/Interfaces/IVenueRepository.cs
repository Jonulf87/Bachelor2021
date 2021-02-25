using System.Collections.Generic;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.DataAccessLayer.Interfaces
{
    public interface IVenueRepository
    {
        // Save/add
        Task<bool> CreateVenue(Venue inVenue);

        // Get all
        Task<List<Venue>> GetVenues();

        // Get one
        Task<Venue> GetVenue(int id);

        // Delete
        Task<bool> DeleteVenue(int id);

        // Modify
        Task<bool> UpdateVenue(Venue modifyVenue);

    }

}
