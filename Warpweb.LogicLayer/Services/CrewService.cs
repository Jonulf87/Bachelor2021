using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class CrewService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<CrewService> _log; //Denne må ordnes. Den er i bruk nede, men vil alltid være null av en eller annen grunn. Foreløpig ukjent

        public CrewService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CrewListVm>> GetCrewsAsync()
        {
            return await _dbContext.Crews
                .Select(a => new CrewListVm
                {
                    CrewId = a.Id,
                    CrewName = a.Name,
                })
                .ToListAsync();
        }

        public async Task<CrewVm> GetCrewAsync(int id)
        {
            return await _dbContext.Crews
                .Where(a => a.Id == id)
                .Select(a => new CrewVm
                {
                    CrewId = a.Id,
                    CrewName = a.Name,
                    //CrewRoles = a.CrewRoles
                }).SingleOrDefaultAsync();
        }

        // TODO: Try - catch w/logging
        public async Task<int> CreateCrewAsync(CrewVm crewVm)
        {
            try
            {
                var existingCrew = _dbContext.Crews
                .Where(a => a.Id == crewVm.CrewId || a.Name == crewVm.CrewName)
                .FirstOrDefault();

                var crew = new Crew
                {
                    Name = crewVm.CrewName,
                    //Roles = crewVm.CrewRoles

                };

                _dbContext.Crews.Add(crew);
                await _dbContext.SaveChangesAsync();

                return crew.Id;
            }
            catch (CrewDoesNotExistException e)
            {
                _log.LogInformation(e.Message);
                return 0;
            }        
        }

        public async Task<int> UpdateCrewAsync(CrewVm crewVm)
        {
            var existingCrew = _dbContext.Crews.Where(a => a.Id == crewVm.CrewId).FirstOrDefault();

            if(existingCrew == null)
            {
                throw new CrewDoesNotExistException("Det finnes ingen crew med denne IDen.");
            }

            // If we get null in any field of incoming object, we assume that we don't need to update this field.
            // But at the same time we have to have some value in this field in order not to delete data from the DB.
            // Therefore we save existing data into the null-fields of the incoming object

            if (crewVm.CrewName == null)
            {
                crewVm.CrewName = existingCrew.Name;
            }

            //if (crewVm.CrewRoles == null)
            //{
            //    crewVm.CrewRoles = existingCrew.Roles;
            //}

            existingCrew.Id = crewVm.CrewId;
            existingCrew.Name = crewVm.CrewName;
            //existingCrew.CrewRoles = crewVm.CrewRoles;

            _dbContext.Update<Crew>(existingCrew);
            await _dbContext.SaveChangesAsync();

            return existingCrew.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> DeleteCrewAsync(CrewVm crewVm)
        {

            var crewToBeDeleted = _dbContext.Crews.Where(a => a.Id == crewVm.CrewId).FirstOrDefault();

            if (crewToBeDeleted == null)
            {
                throw new CrewDoesNotExistException();
            }

            _dbContext.Remove<Crew>(crewToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return crewToBeDeleted.Id;

        }
    }
}
