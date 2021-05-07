using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    public class UserControllerTest : BaseTest
    {
        private const string _firstName3 = "Ola";
        private const string _middleName3 = "";
        private const string _lastName3 = "Nordman";
        private const string _address3 = "Test gate 123";
        private DateTime _dateOfBirth3 = DateTime.Now.AddYears(-20);
        private const string _firstName4 = "Kari";
        private const string _middleName4 = "Testesen";
        private const string _lastName4 = "Evensen";
        private const string _address4 = "Test gate 321";
        private DateTime _dateOfBirth4 = DateTime.Now.AddYears(-25);
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

            Assert.AreEqual(4, result.Count);
            Assert.AreEqual(_createdUser2.Entity.Id, result[1].Id);
            Assert.AreEqual("Line", result[1].FirstName);
            Assert.AreEqual("", result[1].MiddleName);
            Assert.AreEqual("Evensen", result[1].LastName);

            Assert.AreEqual(_createdUser3.Entity.Id, result[2].Id);
            Assert.AreEqual(_firstName3, result[2].FirstName);
            Assert.AreEqual(_middleName3, result[2].MiddleName);
            Assert.AreEqual(_lastName3, result[2].LastName);
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
            Assert.AreEqual("Line", returnedUser.FirstName);
            Assert.AreEqual("", returnedUser.MiddleName);
            Assert.AreEqual("Evensen", returnedUser.LastName);
            Assert.AreEqual("Osloveien 123", returnedUser.Address);

            SetUser(userController, _createdUser3.Entity.Id);
            ActionResult<UserVm> result1 = await userController.GetUserAsync(_createdUser3.Entity.Id);

            UserVm returnedUser1 = result1.Value;
            Assert.AreEqual(_createdUser3.Entity.Id, returnedUser1.Id);
            Assert.AreEqual(_firstName3, returnedUser1.FirstName);
            Assert.AreEqual(_middleName3, returnedUser1.MiddleName);
            Assert.AreEqual(_lastName3, returnedUser1.LastName);
            Assert.AreEqual(_address3, returnedUser1.Address);

        }
   
        // Helper methods
        private void CreateUsers()
        {
            _createdUser3 = _dbContext.ApplicationUsers.Add(new ApplicationUser 
            { 
                FirstName = _firstName3, 
                MiddleName = _middleName3, 
                LastName = _lastName3, 
                Address = _address3, 
                DateOfBirth = _dateOfBirth3 });
            _dbContext.SaveChanges(); 
        }
    }
}
