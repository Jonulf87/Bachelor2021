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
                    Venue = a.Venue,
                    Organizer = a.Organizer
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
                    StartDate = a.StartDateTime,
                    StartTime = a.StartDateTime,
                    EndDate = a.EndDateTime,
                    EndTime = a.EndDateTime
                })
                .SingleOrDefaultAsync();
        }
        public async Task<int> CreateMainEventAsync(MainEventVm maineventVm)
        {
            var existingMainEvent = _dbContext.MainEvents
                .Where(a => a.Id == maineventVm.Id || a.Name == maineventVm.Name)
                .FirstOrDefault();

            if (existingMainEvent != null)
            {
                throw new NotImplementedException(); //Må endres
            }

            DateTime StartDateTime = maineventVm.StartDate.Date + maineventVm.StartTime.TimeOfDay;
            DateTime EndDateTime = maineventVm.EndDate.Date + maineventVm.EndTime.TimeOfDay;

            var mainevent = new MainEvent
            {
                Name = maineventVm.Name,
                StartDateTime = StartDateTime,
                EndDateTime = EndDateTime,
                OrganizerId = maineventVm.OrganizerId,
                VenueId = maineventVm.VenueId
            };

            _dbContext.MainEvents.Add(mainevent);
            await _dbContext.SaveChangesAsync();

            return mainevent.Id;
        }

        public async Task<int> UpdateMainEventAsync(MainEventVm maineventVm)
        {

            var existingMainEvent = _dbContext.MainEvents.Find(maineventVm.Id);

            if (existingMainEvent == null)
            {
                throw new NotImplementedException();
            }

            DateTime StartDateTime = maineventVm.StartDate.Date + maineventVm.StartTime.TimeOfDay;
            DateTime EndDateTime = maineventVm.EndDate.Date + maineventVm.EndTime.TimeOfDay;

            existingMainEvent.Id = maineventVm.Id;
            existingMainEvent.Name = maineventVm.Name;
            existingMainEvent.StartDateTime = StartDateTime;
            existingMainEvent.EndDateTime = EndDateTime;

            _dbContext.Update<MainEvent>(existingMainEvent);
            await _dbContext.SaveChangesAsync();

            return existingMainEvent.Id;
        }

        // Restrict to SuperAdmin
        public async Task<int> RemoveMainEventAsync(MainEventVm mainEventVm)
        {

            var mainEventToBeDeleted = _dbContext.MainEvents.Where(a => a.Id == mainEventVm.Id).FirstOrDefault();

            if (mainEventToBeDeleted == null)
            {
                throw new NotImplementedException();
            }

            _dbContext.Remove<MainEvent>(mainEventToBeDeleted);
            await _dbContext.SaveChangesAsync();

            return mainEventToBeDeleted.Id;

        }

        public async Task<ActionResult<CurrentMainEventVm>> GetCurrentMainEventAsync(string userId)
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
                .Select(b => new CurrentMainEventVm
                {
                    Name = b.CurrentMainEvent.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task SetCurrentEventAsync(int eventId, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            user.CurrentMainEventId = eventId;

            _dbContext.Update<ApplicationUser>(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}
