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
                    Crews = a.Crews
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
                    Crews = a.Crews
                }).SingleOrDefaultAsync();
        }

        public async Task<int> CreateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            /*
            var existingCrewRole = _dbContext.CrewRoles
                .Where(a => a.CrewRoleId == crewroleVm.CrewRoleId)
                .FirstOrDefault();

            if (existingCrewRole == null)
            {
                throw new NotImplementedException();
            }
            */

            var crewrole = new CrewRole
            {
                Description = crewroleVm.Description
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

            _dbContext.Update<CrewRole>(existingCrewRole);
            await _dbContext.SaveChangesAsync();

            return existingCrewRole.CrewRoleId;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteCrewRoleAsync(CrewRoleVm crewroleVm)
        {

            var crewroleToBeDeleted = _dbContext.CrewRoles.Where(a => a.CrewRoleId == crewroleVm.CrewRoleId).FirstOrDefault();

            if (crewroleToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<CrewRole>(crewroleToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return crewroleToBeDeleted.CrewRoleId;

        }
    }
}
