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
    // Creation and maintenance of events.
    // Deletion of events should be restricted to SuperAdmin

    public class MainEventService
    {
        private readonly ApplicationDbContext _dbContext;

        public MainEventService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MainEventListVm>> GetMainEventsAsync()
        {
            return await _dbContext.MainEvents
                .Select(a => new MainEventListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
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
                    StartTime = a.StartTime,
                    EndTime = a.EndTime

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
                throw new NotImplementedException();
            }

            var mainevent = new MainEvent
            {
                Name = maineventVm.Name,
                StartTime = maineventVm.StartTime,
                EndTime = maineventVm.EndTime
            };

            _dbContext.MainEvents.Add(mainevent);
            await _dbContext.SaveChangesAsync();

            return mainevent.Id;
        }

        public async Task<int> UpdateMainEventAsync(MainEventVm maineventVm)
        {

            var existingMainEvent = _dbContext.MainEvents.Where(a => a.Id == maineventVm.Id).FirstOrDefault();

            if (existingMainEvent == null)
            {
                throw new NotImplementedException();
            }

            existingMainEvent.Id = maineventVm.Id;
            existingMainEvent.Name = maineventVm.Name;
            existingMainEvent.StartTime = maineventVm.StartTime;
            existingMainEvent.EndTime = maineventVm.EndTime;

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
    }
}
