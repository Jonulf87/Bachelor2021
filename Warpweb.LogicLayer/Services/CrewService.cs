using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class CrewService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public CrewService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }

        /// <summary>
        /// Returns all crews
        /// </summary>
        /// <returns>List of CrewListVm</returns>
        public async Task<List<CrewListVm>> GetCrewsAsync()
        {
            var crewsList = await _dbContext.Crews
                .Select(a => new CrewListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                })
                .ToListAsync();

            return crewsList;
        }

        /// <summary>
        /// Return specific crew
        /// </summary>
        /// <param name="crewId"></param> 
        /// <returns>CrewVm</returns>
        public async Task<CrewVm> GetCrewAsync(int id)
        {

            var crew = await _dbContext.Crews
                .Where(a => a.Id == id)
                .Select(a => new CrewVm
                {
                    CrewId = a.Id,
                    CrewName = a.Name
                }).SingleOrDefaultAsync();

            if (crew == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ikke arbeidslaget med id {id}");
            }

            return crew;
        }

        /// <summary>
        /// Create crew
        /// </summary>
        /// <param name="crewName"></param>
        public async Task CreateCrewAsync(string crewName)
        {
            if (crewName == null)
            {
                throw new HttpException(HttpStatusCode.InternalServerError, "Du kan ikke sende en tom streng som navn til arbeidslaget");
            }

            var existingCrew = _dbContext.Crews
             .Where(a => a.Name == crewName)
             .SingleOrDefault();

            if (existingCrew != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Arbeidslaget: {crewName} eksisterer allerede");
            }

            var crew = new Crew
            {
                Name = crewName,
                MainEventId = _mainEventProvider.MainEventId
            };

            _dbContext.Crews.Add(crew);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Modify crew
        /// </summary>
        /// <param name="crewVm"></param> 
        public async Task UpdateCrewAsync(CrewVm crewVm)
        {
            var existingCrew = _dbContext.Crews.Where(a => a.Id == crewVm.CrewId).SingleOrDefault();

            if (existingCrew == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ikke arbeidslaget: {crewVm.CrewName}");
            }

            if (crewVm.CrewName == null)
            {
                crewVm.CrewName = existingCrew.Name;
            }

            existingCrew.Id = crewVm.CrewId;
            existingCrew.Name = crewVm.CrewName;

            _dbContext.Update<Crew>(existingCrew);
            await _dbContext.SaveChangesAsync();

        }

        /// <summary>
        /// Add crewmember to crew with specific ID
        /// </summary>
        /// <param name="crewId"></param>
        /// <param name="userId"></param>
        public async Task AddCrewMemberAsync(int crewId, string userId)
        {
            if (userId == null || crewId <= 0)
            {
                throw new HttpException(HttpStatusCode.BadRequest, "Mangler ID på arbeidslag eller bruker");
            }

            var existingCrewUser = await _dbContext.CrewUsers
                .Where(a => a.CrewId == crewId && a.ApplicationUserId == userId)
                .SingleOrDefaultAsync();

            if (existingCrewUser != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Bruker: {existingCrewUser.ApplicationUser.FirstName} er allerede lagt til i arbeidslaget");
            }

            var crewUser = new CrewUser
            {
                ApplicationUserId = userId,
                IsLeader = false,
                CrewId = crewId
            };

            _dbContext.CrewUsers.Add(crewUser);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Returns crewmembers in crew with specific ID
        /// </summary>
        /// <param name="crewId"></param> 
        /// <returns>CrewMemberListVm</returns>
        public async Task<List<CrewMembersListVm>> GetCrewMembersAsync(int crewId)
        {
            var crew = await _dbContext.Crews
                .Where(a => a.Id == crewId)
                .Include(a => a.Users)
                .ThenInclude(a => a.ApplicationUser)
                .SingleOrDefaultAsync();

            if (crew == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ikke arbeidslaget med ID: {crewId}");
            }

            var crewUsers = crew.Users
                .Where(a => !a.IsLeader)
                .Select(a => new CrewMembersListVm
                {
                    Id = a.ApplicationUserId,
                    Name = a.ApplicationUser.FirstName + " " + a.ApplicationUser.LastName,
                    EMail = a.ApplicationUser.Email,
                    Phone = a.ApplicationUser.PhoneNumber,
                    Comment = a.Comment,
                    IsLeader = a.IsLeader

                }).ToList();

            if (crewUsers == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Arbeidslaget har ingen medlemmer");
            }

            return crewUsers;
        }

        /// <summary>
        /// Removes crewmember from crew
        /// </summary>
        public async Task RemoveCrewMemberAsync(RemoveCrewMemberVm crewMember)
        {
            var user = await _dbContext.ApplicationUsers.FindAsync(crewMember.UserId);

            if (user == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ikke brukeren med id: {crewMember.UserId}");
            }

            var crewMemberExisting = await _dbContext.CrewUsers
                .Where(a => a.CrewId == crewMember.CrewId && a.ApplicationUserId == crewMember.UserId)
                .FirstOrDefaultAsync();

            if (crewMemberExisting == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Brukeren er ikke i arbeidslaget, og kan derfor ikke fjernes");
            }

            _dbContext.CrewUsers.Remove(crewMemberExisting);
            await _dbContext.SaveChangesAsync();
        }


        /// <summary>
        /// Add crewleader to crew with specific ID
        /// </summary>
        /// <param int="crewId"></param>
        /// <param string="userId"></param>
        public async Task AddCrewLeaderAsync(int crewId, string userId)
        {
            if (userId == null || crewId <= 0)
            {
                throw new HttpException(HttpStatusCode.BadRequest, "Mangler ID på arbeidslag eller bruker");
            }

            var existingCrewUser = await _dbContext.CrewUsers
                .Where(a => a.CrewId == crewId && a.ApplicationUserId == userId)
                .SingleOrDefaultAsync();

            if (existingCrewUser != null)
            {
                existingCrewUser.IsLeader = true;
            }
            else
            {
                var crewUser = new CrewUser
                {
                    ApplicationUserId = userId,
                    IsLeader = true,
                    CrewId = crewId
                };

                _dbContext.CrewUsers.Add(crewUser);
            }

            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Get crewleaders from crew with specific ID
        /// </summary>
        /// <param int="crewId"></param>
        public async Task<List<CrewMembersListVm>> GetCrewLeadersAsync(int crewId)
        {
            var crew = await _dbContext.Crews
                .Where(a => a.Id == crewId)
                .Include(a => a.Users)
                .ThenInclude(a => a.ApplicationUser)
                .SingleOrDefaultAsync();

            if (crew == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen arbeidslagsledere til arbeidslaget med id {crewId}");
            }

            return crew.Users
                .Where(a => a.IsLeader)
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

        /// <summary>
        /// Delete crew
        /// </summary>
        /// <param name="crewVm"></param> 
        public async Task DeleteCrewAsync(CrewVm crewVm)
        {

            var crewToBeDeleted = await _dbContext.Crews.Where(a => a.Id == crewVm.CrewId).SingleOrDefaultAsync();

            if (crewToBeDeleted == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ikke arbeidslaget: {crewVm.CrewName}");
            }

            _dbContext.Remove<Crew>(crewToBeDeleted);
            await _dbContext.SaveChangesAsync();

        }

        /// <summary>
        /// Returns crews current user is member of
        /// </summary>
        public async Task<List<CrewListVm>> GetCrewsUserIsMemberOfAsync(string userId)
        {
            if (userId == null)
            {
                throw new HttpException(HttpStatusCode.BadRequest, "Mangler bruker ID");
            }

            return await _dbContext.CrewUsers
                .Where(a => a.ApplicationUserId == userId)
                .Select(a => new CrewListVm
                {
                    Name = a.Crew.Name,
                    Id = a.Crew.Id
                }).ToListAsync();
        }
    }
}
