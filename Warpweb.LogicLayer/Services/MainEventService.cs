using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class MainEventService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _userManager;

        public MainEventService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        /// <summary>
        /// Returns all events
        /// </summary>
        public async Task<List<MainEventListVm>> GetMainEventsAsync()
        {
            var mainEvents = await _dbContext.MainEvents
                .Select(a => new MainEventListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartDateTime = a.StartDateTime,
                    EndDateTime = a.EndDateTime,
                    VenueName = a.Venue.Name,
                    OrganizerName = a.Organizer.Name,
                    InfoComments = a.InfoComments,
                    OrganizerWebPage = a.OrganizerWebPage
                })
                .ToListAsync();

            if(mainEvents == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Finner ingen arrangementer");
            }
            else
            {
                return mainEvents;
            }    
        }

        /// <summary>
        /// Returns all future events
        /// </summary>
        public async Task<List<MainEventListVm>> GetUpcomingEventsAsync()
        {
            var upcomingMainEvents = await _dbContext.MainEvents
                .Where(a => a.EndDateTime > DateTime.Now)
                .Select(a => new MainEventListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartDateTime = a.StartDateTime,
                    EndDateTime = a.EndDateTime,
                    VenueName = a.Venue.Name,
                    OrganizerName = a.Organizer.Name,
                    InfoComments = a.InfoComments,
                    OrganizerWebPage = a.OrganizerWebPage
                })
                .ToListAsync();

            if(upcomingMainEvents == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Finner ingen fremtidige arrangementer");
            }
            else
            {
                return upcomingMainEvents;
            }
        }

        /// <summary>
        /// Returns a specific Event.
        /// </summary>
        /// <param name="id"></param>  
        public async Task<MainEventVm> GetMainEventAsync(int id)
        {
            var mainEvent = await _dbContext.MainEvents
                .Where(a => a.Id == id)
                .Select(a => new MainEventVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartDateTime = a.StartDateTime,
                    EndDateTime = a.EndDateTime,
                    OrganizerId = a.OrganizerId,
                    VenueId = a.VenueId,
                    VenueName = a.Venue.Name,
                    InfoComments = a.InfoComments,
                    OrganizerWebPage = a.OrganizerWebPage,
                    OrganizerName = a.Organizer.Name
                })
                .SingleOrDefaultAsync();

            if (mainEvent == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen arrangementer med id: {id}");
            }
            else
            {
                return mainEvent;
            }
            
        }

        /// <summary>
        /// Creates a new Event.
        /// </summary>
        /// <param name="mainEventVm"></param>
        /// /// <param name="userId"></param>
        /// <remarks>
        /// A default management crew with crew permissions is created along with the MainEvent.
        /// </remarks>
        public async Task CreateMainEventAsync(MainEventVm maineventVm, string userId)
        {
            var existingMainEvent = await _dbContext.MainEvents
                .Where(a => a.Id == maineventVm.Id || a.Name == maineventVm.Name)
                .SingleOrDefaultAsync();


            if (existingMainEvent != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Arrangementet: {existingMainEvent.Name} eksisterer allerede");
            }

            var leaderCrew = new Crew
            {
                Name = "Ledelse",
                Users = new List<CrewUser>
                {
                    new CrewUser
                    {
                        ApplicationUserId = userId,
                        IsLeader = true,
                        Comment = "Arrangementsleder"
                    }
                },
                CrewPermissions = new List<CrewPermission>()
            };

            var crewPermissionTypes = Enum.GetValues(typeof(CrewPermissionType)).Cast<CrewPermissionType>();

            foreach (var crewPermissionType in crewPermissionTypes)
            {
                leaderCrew.CrewPermissions
                    .Add(new CrewPermission
                    {
                        PermissionType = crewPermissionType
                    });
            }

            var mainevent = new MainEvent
            {
                Name = maineventVm.Name,
                StartDateTime = maineventVm.StartDateTime,
                EndDateTime = maineventVm.EndDateTime,
                OrganizerId = maineventVm.OrganizerId,
                VenueId = maineventVm.VenueId,
                Crews = new List<Crew>
                { 
                    leaderCrew
                }
            };

            _dbContext.MainEvents.Add(mainevent);
            await _dbContext.SaveChangesAsync();

            var user = await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
                .SingleOrDefaultAsync();
            
            user.CurrentMainEventId = mainevent.Id;
            await _dbContext.SaveChangesAsync();
            
        }

        /// <summary>
        /// Updates a specific Event.
        /// </summary>
        /// <param name="mainEventVm"></param> 
        public async Task UpdateMainEventAsync(MainEventVm maineventVm)
        {

            var existingMainEvent = await _dbContext.MainEvents
               .Where(a => a.Id != maineventVm.Id && a.Name == maineventVm.Name)
               .SingleOrDefaultAsync();


            if (existingMainEvent != null)
            {
                throw new HttpException(HttpStatusCode.Conflict, $"Arrangementet: {existingMainEvent.Name} eksisterer allerede");
            }

            existingMainEvent = _dbContext.MainEvents.Find(maineventVm.Id);

            if (existingMainEvent == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, "Fant ikke arrangementet");
            }     

            existingMainEvent.Id = maineventVm.Id;
            existingMainEvent.Name = maineventVm.Name;
            existingMainEvent.StartDateTime = maineventVm.StartDateTime;
            existingMainEvent.EndDateTime = maineventVm.EndDateTime;
            existingMainEvent.VenueId = maineventVm.VenueId;

            _dbContext.Update(existingMainEvent);
            await _dbContext.SaveChangesAsync();

        }

        /// <summary>
        /// Returns all events where user is participant
        /// </summary>
        /// <param name="userId"></param> 
        public async Task<List<UserMainEventsVm>> GetMainEventsOfUserParticipationAsync(string userId)
        {

            var mainEventsOfUserParticipation = await _dbContext.Tickets
                .Where(a => a.ApplicationUserId == userId)
                .IgnoreQueryFilters()
                .Select(c => new UserMainEventsVm
                {
                    Id = c.MainEventId,
                    Name = c.MainEvent.Name,
                    End = c.MainEvent.EndDateTime,
                    Start = c.MainEvent.StartDateTime,
                    Venue = c.MainEvent.Venue.Name
                })
                .Distinct()
                .ToListAsync();

            if(mainEventsOfUserParticipation == null)
            {

                    throw new HttpException(HttpStatusCode.NotFound, $"Finner ingen arrangementer der bruker med id: {userId} deltar");
            }
            else
            {
                return mainEventsOfUserParticipation;
            }
            
        }

        /// <summary>
        /// Returns current active event
        /// </summary>
        /// <param name="userId"></param>
        public async Task<ActionResult<CurrentMainEventVm>> GetCurrentMainEventAsync(string userId)
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
                .Select(b => new CurrentMainEventVm
                {
                    Name = b.CurrentMainEvent.Name,
                    OrganizerId = b.CurrentMainEvent.OrganizerId
                })
                .SingleOrDefaultAsync();
        }

        /// <summary>
        /// Sets the active event
        /// </summary>
        /// <param name="eventId"></param> 
        /// <param name="userId"></param>  
        public async Task SetCurrentEventAsync(int eventId, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            user.CurrentMainEventId = eventId;

            _dbContext.Update<ApplicationUser>(user);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Returns events where current user is organization admin
        /// </summary>
        public async Task<List<MainEventListVm>> GetMainEventsForOrgAdminAsync(string userId)
        {
            var events = await _dbContext.MainEvents
                .Where(a => a.Organizer.Admins.Any(b => b.Id == userId))
                .Select(a => new MainEventListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartDateTime = a.StartDateTime,
                    EndDateTime = a.EndDateTime,
                    OrganizerName = a.Organizer.Name,
                    VenueName = a.Venue.Name
                }).ToListAsync();


            if(events == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Ingen arrangementer registrert på bruker med id {userId} ");
            }
            else
            {
                return events;
            }
            
        }
    }
}
