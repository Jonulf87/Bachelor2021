using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class SecurityService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SecurityService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<List<CrewPermissionType>> GetPoliciesAsync(string userId)
        {
            return await _dbContext.CrewUsers
                .Where(a => a.ApplicationUserId == userId)
                .Select(a => a.Crew)
                .SelectMany(a => a.CrewPermissions)
                .Select(a => a.PermissionType)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<OrganizerListVm>> GetOrganizersUserIsAdminAtAsync(string userId)
        {
            return await _dbContext.Organizers
                .Where(a => a.Admins.Any(b => b.Id == userId))
                .Select(a => new OrganizerListVm
                {
                    Id = a.Id,
                    Name = a.Name,
                    OrgNumber = a.OrgNumber
                }).ToListAsync();

        }

        public async Task<List<UserRolesListVm>> GetUserRolesAsync(string id)
        {

            var user = await _userManager.FindByIdAsync(id);
            var userRoles = await _userManager.GetRolesAsync(user);

            var roles = _roleManager.Roles;

            return roles.Select(a => new UserRolesListVm
            {
                Name = a.Name,
                UserHasRole = userRoles.Any(b => b == a.Name)
            }).ToList();
        }

        public async Task RegisterUserAsync(UserVm user)
        {
            var userExists = await _userManager.FindByEmailAsync(user.EMail);

            if(userExists != null)
            {
                throw new UserAlreadyExistsException();
            }

            var userDataToBeStored = new ApplicationUser
            {
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Address = user.Address,
                ZipCode = user.ZipCode,
                Team = user.Team,
                DateOfBirth = user.DateOfBirth,
                IsAllergic = user.IsAllergic,
                AllergyDescription = user.AllergyDescription,
                Gender = user.Gender,
                Comments = user.Comments,
                PhoneNumber = user.PhoneNumber,
                Email = user.EMail,
                UserName = user.UserName
            };

            var result = await _userManager.CreateAsync(userDataToBeStored, user.Password);

            if(!result.Succeeded)
            {
                throw new Exception(string.Join(Environment.NewLine, result.Errors.Select(a => a.Description)));
            }

            if(!user.ParentPhoneNumber.IsNullOrEmpty())
            {
                var parentToBeStored = new Guardian
                {
                    FirstName = user.ParentFirstName,
                    LastName = user.ParentLastName,
                    PhoneNumber = user.ParentPhoneNumber,
                    EMail = user.ParentEMail,
                    ApplicationUserId = userDataToBeStored.Id
                };

                var resultparent = _dbContext.Guardians.Add(parentToBeStored);
                var test = _dbContext.SaveChanges();
            }

            await _userManager.AddToRoleAsync(userDataToBeStored, "User");
        }

        public async Task<bool> HasCrewPermissionAsync(string userId, CrewPermissionType crewPermissionType)
        {
            return await _dbContext.Crews
                .Where(a => a.CrewPermissions.Any(b => b.PermissionType == crewPermissionType)
                    && a.Users.Any(c => c.ApplicationUserId == userId))
                .AnyAsync();
        }
    }
}
