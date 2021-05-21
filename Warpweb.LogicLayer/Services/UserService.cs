using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMainEventProvider _mainEventProvider;
        private readonly SecurityService _securityService;

        public UserService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, IMainEventProvider mainEventProvider, SecurityService securityService)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _mainEventProvider = mainEventProvider;
            _securityService = securityService;
        }

        /// <summary>
        /// Returns all users
        /// </summary>
        /// <returns>UserListVm</returns>
        public async Task<List<UserListVm>> GetUsersAsync(string userId)
        {
            var user = await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
                .Include(a => a.AdminRoleAtOrganizers)
                .SingleOrDefaultAsync();

            var userOrgs = await _dbContext.Organizers
                .Where(a => a.Admins.Any(b => b.Id == userId)
                    || a.MainEvents.Any(b => b.Crews.Any(c => c.CrewPermissions.Any(d => d.PermissionType == CrewPermissionType.UserAdmin)
                        && c.Users.Any(d => d.ApplicationUserId == userId))))
                .Select(a => a.Id)
                .ToListAsync();

            var userRoles = await _userManager.GetRolesAsync(user);

            if (userRoles.Contains("Admin"))
            {
                return await _dbContext.ApplicationUsers
                    .OrderBy(a => a.FirstName)
                    .ThenBy(a => a.LastName)
                    .Select(a => new UserListVm
                    {
                        Id = a.Id,
                        FirstName = a.FirstName,
                        MiddleName = a.MiddleName,
                        LastName = a.LastName,
                        EMail = a.Email,
                        PhoneNumber = a.PhoneNumber,
                        UserName = a.UserName,
                        DateOfBirth = a.DateOfBirth
                    })
                    .ToListAsync();
            }
            else if (await _securityService.HasCrewPermissionAsync(userId, CrewPermissionType.UserAdmin) || user.AdminRoleAtOrganizers.Any())
            {
                var users = await _dbContext.ApplicationUsers
                    .Where(a => a.Tickets.Any(a => userOrgs.Contains(a.MainEvent.OrganizerId)))
                    .IgnoreQueryFilters()
                    .OrderBy(a => a.FirstName)
                    .ThenBy(a => a.LastName)
                    .Select(a => new UserListVm
                    {
                        Id = a.Id,
                        FirstName = a.FirstName,
                        MiddleName = a.MiddleName,
                        LastName = a.LastName,
                        EMail = a.Email,
                        PhoneNumber = a.PhoneNumber,
                        UserName = a.UserName,
                        DateOfBirth = a.DateOfBirth
                    })
                    .ToListAsync();

                return users;
            }
            else
            {
                throw new HttpException(HttpStatusCode.Forbidden, "Du har ikke tilgang til denne listen");
            }

        }

        /// <summary>
        /// Returns all participants of specific event
        /// </summary>
        /// <returns>ParticipantListVm</returns>
        public async Task<List<ParticipantListVm>> GetParticipantsAsync()
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Tickets.Any(a => a.MainEventId == _mainEventProvider.MainEventId))
                .OrderBy(a => a.FirstName)
                .ThenBy(a => a.LastName)
                .Select(a => new ParticipantListVm
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    MiddleName = a.MiddleName,
                    LastName = a.LastName,
                    EMail = a.Email,
                    PhoneNumber = a.PhoneNumber,
                    UserName = a.UserName,
                    DateOfBirth = a.DateOfBirth
                })
                .ToListAsync();
        }

        /// <summary>
        /// Returns currently active user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>UserVm</returns>
        public async Task<UserVm> GetCurrentUserAsync(string userId)
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
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



        /// <summary>
        /// Returns user with Id == userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>UserVm</returns>
        public async Task<UserVm> GetUserAsync(string userId)
        {
            return await _dbContext.ApplicationUsers
                .Where(a => a.Id == userId)
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

        /// <summary>
        /// Checks that username is available
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>UserNameCheckVm</returns>
        public async Task<UserNameCheckVm> CheckUserNameAsync(string userName)
        {
            var userNameUnavailable = await _dbContext.ApplicationUsers
                .Where(a => a.UserName == userName)
                .AnyAsync();

            return new UserNameCheckVm
            {
                IsUnavailable = userNameUnavailable
            };
        }

        /// <summary>
        /// Checks that email is available
        /// </summary>
        /// <param name="eMail"></param>
        /// <returns>EMailCheckVm</returns>
        public async Task<ActionResult<EMailCheckVm>> CheckEMailAsync(string eMail)
        {
            var eMailUnavailable = await _dbContext.ApplicationUsers
                .Where(a => a.Email == eMail)
                .AnyAsync();

            return new EMailCheckVm
            {
                IsUnavailable = eMailUnavailable
            };
        }

        /// <summary>
        /// Updates user
        /// </summary>
        /// <param name="userVm"></param>
        /// <param name="userId"></param>
        public async Task UpdateUserAsync(UserUpdateVm userVm, string userId)
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (existingUser == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen bruker med navn: {userVm.FirstName} {userVm.LastName}");
            }

            existingUser.FirstName = userVm.FirstName;
            existingUser.MiddleName = userVm.MiddleName;
            existingUser.LastName = userVm.LastName;
            existingUser.Address = userVm.Address;
            existingUser.ZipCode = userVm.ZipCode;
            existingUser.PhoneNumber = userVm.PhoneNumber;
            existingUser.Team = userVm.Team;
            existingUser.IsAllergic = userVm.IsAllergic;
            existingUser.AllergyDescription = userVm.AllergyDescription;
            existingUser.Comments = userVm.Comments;

            var guardianToBeUpdated = await _dbContext.Guardians
                .SingleOrDefaultAsync(a => a.ApplicationUserId == userId);

            if (guardianToBeUpdated != null)
            {
                guardianToBeUpdated.EMail = userVm.ParentEMail;
                guardianToBeUpdated.FirstName = userVm.ParentFirstName;
                guardianToBeUpdated.LastName = userVm.ParentLastName;
                guardianToBeUpdated.PhoneNumber = userVm.ParentPhoneNumber;

                _dbContext.Update<Guardian>(guardianToBeUpdated);
                await _dbContext.SaveChangesAsync();
            }

            await _userManager.UpdateAsync(existingUser);

        }

        /// <summary>
        /// Update user username
        /// </summary>
        /// <param name="data"></param>
        /// <param name="userId"></param>
        public async Task UpdateUsernameAsync(UsernameUpdateVm data, string userId)
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (existingUser == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen bruker med denne ID'en");
            }

            existingUser.UserName = data.Username;

            await _userManager.UpdateAsync(existingUser);
        }

        /// <summary>
        /// Update user email
        /// </summary>
        /// <param name="data"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task UpdateEMailAsync(EMailUpdateVm data, string userId)
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (existingUser == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen bruker med denne ID'en");
            }

            existingUser.Email = data.EMail;

            await _userManager.UpdateAsync(existingUser);
        }

        /// <summary>
        /// Update user password
        /// </summary>
        /// <param name="data"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task UpdatePasswordAsync(PasswordUpdateVm data, string userId)
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (!await _userManager.CheckPasswordAsync(existingUser, data.OldPassword))
            {
                throw new HttpException(HttpStatusCode.Forbidden, "Det gamle passordet er ugyldig");
            }

            if (existingUser == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen bruker med denne ID'en");
            }

            await _userManager.ChangePasswordAsync(existingUser, data.OldPassword, data.NewPassword);
        }

    }
}
