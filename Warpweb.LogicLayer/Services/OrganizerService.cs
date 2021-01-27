using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class OrganizerService
    {
        private readonly ApplicationDbContext _dbContext;

        public OrganizerService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<OrganizerListVm>> GetOrganizersAsync()
        {
            return await _dbContext.Organizers
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
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
                    OrgNumber = a.OrgNumber
                })
                .SingleOrDefaultAsync();
        }

        public async Task CreateOrganizerAsync(OrganizerVm organizerVm)
        {
            //Sjekke orgnummer og navn før videre
            throw new NotImplementedException();
        }
    }
}
