using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
            return await _dbContext.CrewUsers
                .Select(a => new CrewRoleListVm
                {
                    CrewRoleId = a.Id,
                    IsLeader = a.IsLeader,
                    CrewId = a.CrewId
                })
                .ToListAsync();
        }

        public async Task<CrewRoleVm> GetCrewRoleAsync(int id)
        {
            return await _dbContext.CrewUsers
                .Where(a => a.Id == id)
                .Select(a => new CrewRoleVm
                {
                    CrewRoleId = a.Id,
                    IsLeader = a.IsLeader,
                    CrewId = a.CrewId
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

            var crewrole = new CrewUser
            {
                IsLeader = crewroleVm.IsLeader
            };

            _dbContext.CrewUsers.Add(crewrole);
            await _dbContext.SaveChangesAsync();

            return crewrole.Id;
        }

        public async Task<int> UpdateCrewRoleAsync(CrewRoleVm crewroleVm)
        {
            var existingCrewRole = _dbContext.CrewUsers.Where(a => a.Id == crewroleVm.CrewRoleId).FirstOrDefault();

            if (existingCrewRole == null)
            {
                throw new NotImplementedException();
            }

            existingCrewRole.Id = crewroleVm.CrewRoleId;
            existingCrewRole.IsLeader = crewroleVm.IsLeader;

            _dbContext.Update<CrewUser>(existingCrewRole);
            await _dbContext.SaveChangesAsync();

            return existingCrewRole.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteCrewRoleAsync(CrewRoleVm crewroleVm)
        {

            var crewroleToBeDeleted = _dbContext.CrewUsers.Where(a => a.Id == crewroleVm.CrewRoleId).FirstOrDefault();

            if (crewroleToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<CrewUser>(crewroleToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return crewroleToBeDeleted.Id;

        }
    }
}
