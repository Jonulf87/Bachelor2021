using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
    public class CrewService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<CrewService> _log;

        public CrewService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CrewListVm>> GetCrewsAsync()
        {
            return await _dbContext.Crews
                .Select(a => new CrewListVm
                {
                    CrewId = a.CrewId,
                    CrewName = a.CrewName,
                })
                .ToListAsync();
        }

        public async Task<CrewVm> GetCrewAsync(int id)
        {
            return await _dbContext.Crews
                .Where(a => a.CrewId == id)
                .Select(a => new CrewVm
                {
                    CrewId = a.CrewId,
                    CrewName = a.CrewName,
                    CrewRoles = a.CrewRoles
                }).SingleOrDefaultAsync();
        }

        // TODO: Try - catch w/logging
        public async Task<int> CreateCrewAsync(CrewVm crewVm)
        {
            try
            {
                var existingCrew = _dbContext.Crews
                .Where(a => a.CrewId == crewVm.CrewId || a.CrewName == crewVm.CrewName)
                .FirstOrDefault();

                var crew = new Crew
                {
                    CrewName = crewVm.CrewName,
                    CrewRoles = crewVm.CrewRoles

                };

                _dbContext.Crews.Add(crew);
                await _dbContext.SaveChangesAsync();

                return crew.CrewId;
            }
            catch (CrewDoesNotExistException e)
            {
                _log.LogInformation(e.Message);
                return 0;
            }        
        }

        public async Task<int> UpdateCrewAsync(CrewVm crewVm)
        {
            var existingCrew = _dbContext.Crews.Where(a => a.CrewId == crewVm.CrewId).FirstOrDefault();

            if(existingCrew == null)
            {
                throw new CrewDoesNotExistException("Det finnes ingen crew med denne IDen.");
            }

            existingCrew.CrewId = crewVm.CrewId;
            existingCrew.CrewName = crewVm.CrewName;
            existingCrew.CrewRoles = crewVm.CrewRoles;

            _dbContext.Update<Crew>(existingCrew);
            await _dbContext.SaveChangesAsync();

            return existingCrew.CrewId;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteCrewAsync(CrewVm crewVm)
        {

            var crewToBeDeleted = _dbContext.Crews.Where(a => a.CrewId == crewVm.CrewId).FirstOrDefault();

            if (crewToBeDeleted == null)
            {
                throw new CrewDoesNotExistException();
            }

            _dbContext.Remove<Crew>(crewToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return crewToBeDeleted.CrewId;

        }
    }
}
