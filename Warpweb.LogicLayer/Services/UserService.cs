﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    public class UserService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<List<UserListVm>> GetUsersAsync()
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

        public async Task UpdateUserAsync(UserUpdateVm userVm)
        {
            var existingUser = _dbContext.ApplicationUsers.Where(a => a.Id == userVm.Id).SingleOrDefault();

            if (existingUser == null)
            {
                throw new HttpException(HttpStatusCode.NotFound, $"Fant ingen bruker med Id: {userVm.Id}");
            }

            existingUser.Id = userVm.Id;
            existingUser.FirstName = userVm.FirstName;
            existingUser.MiddleName = userVm.MiddleName;
            existingUser.LastName = userVm.LastName;
            existingUser.Address = userVm.Address;
            existingUser.ZipCode = userVm.ZipCode;
            existingUser.PhoneNumber = userVm.PhoneNumber;
            existingUser.UserName = userVm.UserName;
            existingUser.Team = userVm.Team;
            existingUser.IsAllergic = userVm.IsAllergic;
            existingUser.AllergyDescription = userVm.AllergyDescription;
            existingUser.Comments = userVm.Comments;

            var guardianToBeUpdated = existingUser.Guardian;

            if (guardianToBeUpdated != null)
            {
                guardianToBeUpdated.EMail = userVm.ParentEMail;
                guardianToBeUpdated.FirstName = userVm.ParentFirstName;
                guardianToBeUpdated.LastName = userVm.ParentLastName;
                guardianToBeUpdated.PhoneNumber = userVm.ParentPhoneNumber;

                _dbContext.Update<Guardian>(guardianToBeUpdated);
                _dbContext.SaveChanges();
            }

            _dbContext.Update<ApplicationUser>(existingUser);
            await _dbContext.SaveChangesAsync();
        }
    }
}
