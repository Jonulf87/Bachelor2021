﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    public class UserControllerTest : BaseTest
    {
        private const string _firstName3 = "Olav";
        private const string _middleName3 = "";
        private const string _lastName3 = "Nordman";
        private const string _address3 = "Test gate 123";
        private const string _email3 = "olav@test.no";
        private const string _phone3 = "95265985";
        private const string _userName3 = "OlavNordman";
        private DateTime _dateOfBirth3 = DateTime.Now.AddYears(-20);
        private UserManager<ApplicationUser> _userManager;
        private  RoleManager<IdentityRole> _roleManager;

        EntityEntry<ApplicationUser> _createdUser3;

        [Test]
        public async Task ShouldGetUsers()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            List<UserListVm> result = await userController.GetUsersAsync();

            Assert.AreEqual(3, result.Count);
            Assert.That(result, Has.Exactly(1).Matches<UserListVm>(user => user.Id == _createdUser2.Entity.Id && 
                                                                           user.FirstName == _createdUser2.Entity.FirstName && 
                                                                           user.MiddleName == _createdUser2.Entity.MiddleName && 
                                                                           user.LastName == _createdUser2.Entity.LastName &&
                                                                           user.EMail == _createdUser2.Entity.Email &&
                                                                           user.UserName == _createdUser2.Entity.UserName &&
                                                                           user.PhoneNumber == _createdUser2.Entity.PhoneNumber));

            Assert.That(result, Has.Exactly(1).Matches<UserListVm>(user => user.Id == _createdUser3.Entity.Id && 
                                                                           user.FirstName == _createdUser3.Entity.FirstName && 
                                                                           user.MiddleName == _createdUser3.Entity.MiddleName && 
                                                                           user.LastName == _createdUser3.Entity.LastName &&
                                                                           user.EMail == _createdUser3.Entity.Email &&
                                                                           user.UserName == _createdUser3.Entity.UserName &&
                                                                           user.PhoneNumber == _createdUser3.Entity.PhoneNumber));
        }

        [Test]
        public async Task ShouldGetCurrentUser()
        {
            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            ActionResult<UserVm> result = await userController.GetCurrentUserAsync();

            UserVm returnedUser = result.Value;
            Assert.AreEqual(_createdUser2.Entity.Id, returnedUser.Id);
            Assert.AreEqual(_createdUser2.Entity.FirstName, returnedUser.FirstName);
            Assert.AreEqual(_createdUser2.Entity.MiddleName, returnedUser.MiddleName);
            Assert.AreEqual(_createdUser2.Entity.LastName, returnedUser.LastName);
            Assert.AreEqual(_createdUser2.Entity.Address, returnedUser.Address);
        }

        [Test]
        public async Task ShouldGetUserById()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            SetUser(userController, _createdUser2.Entity.Id);
            ActionResult<UserVm> result = await userController.GetUserAsync(_createdUser2.Entity.Id);

            UserVm returnedUser = result.Value;

            Assert.AreEqual(_createdUser2.Entity.Id, returnedUser.Id);
            Assert.AreEqual(_createdUser2.Entity.FirstName, returnedUser.FirstName);
            Assert.AreEqual(_createdUser2.Entity.MiddleName, returnedUser.MiddleName);
            Assert.AreEqual(_createdUser2.Entity.LastName, returnedUser.LastName);
            Assert.AreEqual(_createdUser2.Entity.Address, returnedUser.Address);

            SetUser(userController, _createdUser3.Entity.Id);
            ActionResult<UserVm> result1 = await userController.GetUserAsync(_createdUser3.Entity.Id);

            UserVm returnedUser1 = result1.Value;
            Assert.AreEqual(_createdUser3.Entity.Id, returnedUser1.Id);
            Assert.AreEqual(_firstName3, returnedUser1.FirstName);
            Assert.AreEqual(_middleName3, returnedUser1.MiddleName);
            Assert.AreEqual(_lastName3, returnedUser1.LastName);
            Assert.AreEqual(_address3, returnedUser1.Address);
        }

        [Test]
        public async Task ShouldUpdateUser()
        {
            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            UserUpdateVm userForUpdate = new UserUpdateVm
            {
                Id = _createdUser2.Entity.Id,
                LastName = "Svensen"
            };

            await userController.UpdateUserAsync(userForUpdate);

            ApplicationUser updatedUser = _dbContext.Users.Find(_createdUser2.Entity.Id);
            Assert.AreEqual(userForUpdate.LastName, updatedUser.LastName);


        }

        [Test]
        public void ShouldNotUpdateUserWithInvalidId()
        {
            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<CrewVm> result = await userController.UpdateUserAsync(new UserUpdateVm
                {
                    Id = "123",
                    LastName = "Svensen"
                });
            });
            Assert.That(ex.Message == "Fant ingen bruker med Id: 123");
        }
        /*
        [Test]
        public async Task ShouldRegisterUser()
        {
            _userManager = new Mock<UserManager<ApplicationUser>>();


            UserService userService = new UserService(_dbContext, _userManager);
            SecurityService securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            UserController userController = new UserController(userService, securityService);

            UserVm newUser = new UserVm {
                //Id = "1",
                FirstName = "Anna",
                MiddleName = "",
                LastName = "Svensen",
                Address = "Trosterudgate 1",
                ZipCode = "0684",
                Team = "Test",
                DateOfBirth = DateTime.Now.AddYears(-20),
                IsAllergic = false,
                Gender = "female",
                PhoneNumber = "96325874",
                EMail = "anna@test.no",
                UserName = "AnnaSvensen",
                Password = "PassWord"
            };

            ActionResult<UserVm> result = await userController.RegisterUserAsync(newUser);
            UserVm returnedUser = result.Value;

           // Assert.AreEqual(_createdUser3.Entity.Id, returnedUser.Id);
            Assert.AreEqual(newUser.FirstName, returnedUser.FirstName);
            Assert.AreEqual(newUser.MiddleName, returnedUser.MiddleName);
            Assert.AreEqual(newUser.LastName, returnedUser.LastName);
            Assert.AreEqual(newUser.Address, returnedUser.Address);

        }
      */

        // Helper methods
        private void CreateUsers()
        {
            _createdUser3 = _dbContext.ApplicationUsers.Add(new ApplicationUser
            {
                FirstName = _firstName3,
                MiddleName = _middleName3,
                LastName = _lastName3,
                Address = _address3,
                DateOfBirth = _dateOfBirth3,
                Email = _email3,
                UserName = _userName3,
                PhoneNumber = _phone3
            });
            _dbContext.SaveChanges();

        }
    }
}
