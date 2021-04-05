using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
                    LastName = a.LastName,
                    EMail = a.Email,
                    PhoneNumber = a.PhoneNumber,
                    UserName = a.UserName
                })
                .ToListAsync();
        }

        public async Task<UserVm> GetCurrentUserAsync(string id)
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
                    ZipCode = a.ZipCode,
                    EMail = a.Email,
                    PhoneNumber = a.PhoneNumber,
                    UserName = a.UserName,
                    DateOfBirth = a.DateOfBirth,
                    AllergyDescription = a.AllergyDescription,
                    Comments = a.Comments,
                    Gender = a.Gender,
                    IsAllergic = a.IsAllergic,
                    ParentEMail = a.Guardian.EMail,
                    ParentFirstName = a.Guardian.FirstName,
                    ParentLastName = a.Guardian.LastName,
                    ParentPhoneNumber = a.Guardian.PhoneNumber,
                    Team = a.Team

                }).SingleOrDefaultAsync();
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
                    ZipCode = a.ZipCode,
                    EMail = a.Email,
                    PhoneNumber = a.PhoneNumber,
                    UserName = a.UserName,
                    DateOfBirth = a.DateOfBirth,
                    AllergyDescription = a.AllergyDescription,
                    Comments = a.Comments,
                    Gender = a.Gender,
                    IsAllergic = a.IsAllergic,
                    ParentEMail = a.Guardian.EMail,
                    ParentFirstName = a.Guardian.FirstName,
                    ParentLastName = a.Guardian.LastName,
                    ParentPhoneNumber = a.Guardian.PhoneNumber,
                    Team = a.Team

                }).SingleOrDefaultAsync();
        }
    }
}
