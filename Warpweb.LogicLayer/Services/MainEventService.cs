using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    // Creation and maintenance of events.
    // Deletion of events should be restricted to SuperAdmin

    public class MainEventService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _userManager;

        public MainEventService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<List<MainEventListVm>> GetMainEventsAsync()
        {
            return await _dbContext.MainEvents
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
        }

        public async Task<MainEventVm> GetMainEventAsync(int id)
        {
            return await _dbContext.MainEvents
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
        }
        public async Task CreateMainEventAsync(MainEventVm maineventVm, string userId)
        {
            var existingMainEvent = await _dbContext.MainEvents
                .Where(a => a.Id == maineventVm.Id || a.Name == maineventVm.Name)
                .SingleOrDefaultAsync();


            if (existingMainEvent != null)
            {
                throw new Exception();
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

        public async Task UpdateMainEventAsync(MainEventVm maineventVm)
        {

            var existingMainEvent = await _dbContext.MainEvents
               .Where(a => a.Id != maineventVm.Id && a.Name == maineventVm.Name)
               .SingleOrDefaultAsync();


            if (existingMainEvent != null)
            {
                throw new Exception("Arrangenent med dette navnet eksisterer allerede");
            }

            existingMainEvent = _dbContext.MainEvents.Find(maineventVm.Id);

            if (existingMainEvent == null)
            {
                throw new NotImplementedException();
            }     

            existingMainEvent.Id = maineventVm.Id;
            existingMainEvent.Name = maineventVm.Name;
            existingMainEvent.StartDateTime = maineventVm.StartDateTime;
            existingMainEvent.EndDateTime = maineventVm.EndDateTime;
            existingMainEvent.VenueId = maineventVm.VenueId;

            _dbContext.Update(existingMainEvent);
            await _dbContext.SaveChangesAsync();

        }


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

        public async Task SetCurrentEventAsync(int eventId, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            user.CurrentMainEventId = eventId;

            _dbContext.Update<ApplicationUser>(user);
            await _dbContext.SaveChangesAsync();
        }

        //Metoden henter ut kun de arrangementer som tilhører organisasjonen som pålogget bruker er administrator i.
        public async Task<List<MainEventListVm>> GetMainEventsForOrgAdminAsync(string userId)
        {
            return await _dbContext.MainEvents
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
        }
    }
}
