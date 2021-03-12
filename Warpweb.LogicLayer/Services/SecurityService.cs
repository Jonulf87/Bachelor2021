﻿using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
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

        public async Task<List<OrganizerListVm>> GetOrganizersAsync(string userId)
        {
            return await _dbContext.Organizers
                .Where(a => a.Contact.Id == userId)
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



            //var userHasRole = false;

            //List<UserRolesListVm> userRolesList = new List<UserRolesListVm>();

            //foreach(var role in roles)
            //{
            //    foreach(var userRole in userRoles)
            //    {
            //        if(role.Name == userRole)
            //        {
            //            userHasRole = true;
            //        }
            //    }
            //    userRolesList.Add(new UserRolesListVm() { Name = role.Name, UserHasRole = userHasRole });
            //    userHasRole = false;                
            //}

            //return userRolesList;


        }
    }
}
