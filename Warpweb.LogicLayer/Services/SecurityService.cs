using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class SecurityService
    {
        private readonly ApplicationDbContext _dbContext;

        public SecurityService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<OrganizerListVm>> GetOrganizersAsync(string userId)
        {
            return await _dbContext.Organizers
                .Where(a => a.Contact.Id == userId)
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
                }).ToListAsync();

        }
    }
}
