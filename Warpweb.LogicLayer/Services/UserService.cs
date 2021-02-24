using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserListVm>> GetUsersAsync()
        {
            return await _dbContext.ApplicationUsers
                .Select(a => new UserListVm
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    MiddleName = a.MiddleName,
                    LastName = a.LastName
                })
                .ToListAsync();
        }

        public async Task<UserVm> GetUserAsync(string id)
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Id == id)
                .Select(a => new UserVm
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    MiddleName = a.MiddleName,
                    LastName = a.LastName,
                    Address = a.Address,
                    EMail = a.Email,
                    PhoneNumber = a.PhoneNumber,
                    UserName = a.UserName,
                    DateOfBirth = a.DateOfBirth
                }).SingleOrDefaultAsync();
        }
    }
}
