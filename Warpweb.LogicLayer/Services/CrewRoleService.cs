using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;


namespace Warpweb.LogicLayer.Services
{

    public class CrewRoleService 
    {

        private readonly ApplicationDbContext _dbContext;

        public CrewRoleService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CrewRoleListVm>> GetCrewRolesAsync()
        {
            return await _dbContext.CrewRoles
                .Select(a => new CrewRoleListVm
                {
                    CrewRoleId = a.CrewRoleId,
                    Description = a.Description,
                    Crew = a.Crew
                })
                .ToListAsync();
        }

        public async Task<CrewRoleVm> GetCrewRoleAsync(int id)
        {
            return await _dbContext.CrewRoles
                .Where(a => a.CrewRoleId == id)
                .Select(a => new CrewRoleVm
                {
                    CrewRoleId = a.CrewRoleId,
                    Description = a.Description,
                    Crew = a.Crew
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            var existingCrewRole = _dbContext.CrewRoles
                .Where(a => a.CrewRoleId == crewroleVm.CrewRoleId)
                .FirstOrDefault();

            if (existingCrewRole == null)
            {
                throw new NotImplementedException();
            }

            var crewrole = new CrewRole
            {
                Description = crewroleVm.Description,
                Crew = crewroleVm.Crew
            };

            _dbContext.CrewRoles.Add(crewrole);
            await _dbContext.SaveChangesAsync();

            return crewrole.CrewRoleId;
        }

        public async Task<int> UpdateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            var existingCrewRole = _dbContext.CrewRoles.Where(a => a.CrewRoleId == crewroleVm.CrewRoleId).FirstOrDefault();

            if (existingCrewRole == null)
            {
                throw new NotImplementedException();
            }

            existingCrewRole.CrewRoleId = crewroleVm.CrewRoleId;
            existingCrewRole.Description = crewroleVm.Description;
            existingCrewRole.Crew = crewroleVm.Crew;

            _dbContext.Update<CrewRole>(existingCrewRole);
            await _dbContext.SaveChangesAsync();

            return existingCrewRole.CrewRoleId;
        }
    }
}
