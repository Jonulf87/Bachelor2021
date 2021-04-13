using System;
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

        public CrewService(ApplicationDbContext dbContext, ILogger<CrewService> log)
        {
            _dbContext = dbContext;
            _log = log;
        }

        public async Task<List<CrewListVm>> GetCrewsAsync()
        {
            return await _dbContext.Crews
                .Select(a => new CrewListVm
                {
                    Id = a.Id,
                    Name = a.Name,
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
                    CrewName = a.Name
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
                    Name = crewVm.CrewName
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
            var existingCrew = _dbContext.Crews.Where(a => a.Id == crewVm.CrewId).SingleOrDefault();

            if(existingCrew == null)
            {
                throw new CrewDoesNotExistException("Det finnes ingen crew med denne IDen.");
            }


            if (crewVm.CrewName == null)
            {
                crewVm.CrewName = existingCrew.Name;
            }


            existingCrew.Id = crewVm.CrewId;
            existingCrew.Name = crewVm.CrewName;

            _dbContext.Update<Crew>(existingCrew);
            await _dbContext.SaveChangesAsync();

            return existingCrew.Id;
        }


        public async Task AddCrewMemberAsync(int crewId, string userId)
        {
            var crewUser = new CrewUser
            {
                ApplicationUserId = userId,
                IsLeader = false,
                CrewId = crewId
            };
            if (userId == null || crewId <= 0)
            {
                throw new Exception();
            }

            _dbContext.CrewUsers.Add(crewUser);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CrewMembersListVm>> GetCrewMembersAsync(int crewId)
        {
            var crew = await _dbContext.Crews
                .Where(a => a.Id == crewId)
                .Include(a => a.Users)
                .ThenInclude(a => a.ApplicationUser)
                .SingleOrDefaultAsync();

            if(crew == null)
            {
                throw new CrewDoesNotExistException();
            }

            return crew.Users
                .Select(a => new CrewMembersListVm
                {
                    Id = a.ApplicationUserId,
                    Name = a.ApplicationUser.FirstName + " " + a.ApplicationUser.LastName,
                    EMail = a.ApplicationUser.Email,
                    Phone = a.ApplicationUser.PhoneNumber,
                    Comment = a.Comment,
                    IsLeader = a.IsLeader

                }).ToList();
        }

        public async Task AddCrewLeaderAsync(int crewId, string userId)
        {
            var crewUser = new CrewUser
            {
                ApplicationUserId = userId,
                IsLeader = true,
                CrewId = crewId
            };
            if(userId == null || crewId <= 0)
            {
                throw new Exception();
            }

            _dbContext.CrewUsers.Add(crewUser);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CrewMembersListVm>> GetCrewLeadersAsync(int crewId)
        {
            var crew = await _dbContext.Crews
                .Where(a => a.Id == crewId)
                .Include(a => a.Users)
                .ThenInclude(a => a.ApplicationUser)
                .SingleOrDefaultAsync();

            if (crew == null)
            {
                throw new CrewDoesNotExistException();
            }

            return crew.Users
                .Where(a => a.IsLeader == true)
                .Select(a => new CrewMembersListVm
                {
                    Id = a.ApplicationUserId,
                    Name = a.ApplicationUser.FirstName + " " + a.ApplicationUser.LastName,
                    EMail = a.ApplicationUser.Email,
                    Phone = a.ApplicationUser.PhoneNumber,
                    Comment = a.Comment,
                    IsLeader = a.IsLeader

                }).ToList();
        }

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
