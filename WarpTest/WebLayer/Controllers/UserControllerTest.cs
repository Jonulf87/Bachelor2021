using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
        private const string _firstName1 = "Ola";
        private const string _middleName1 = "";
        private const string _lastName1 = "Nordman";
        private const string _phoneNumber1 = "12345678";
        private const string _address1 = "Test gate 123";
        private const string _email1 = "ola@test.com";
        private const string _userName1 = "user1";
        private const string _firstName2 = "Kari";
        private const string _middleName2 = "Testesen";
        private const string _lastName2 = "Evensen";
        private const string _phoneNumber2 = "98765432";
        private const string _address2 = "Test gate 321";
        private const string _email2 = "kari@test.com";
        private const string _userName2 = "user2";

        private ClaimsIdentity _identity;
        private ClaimsPrincipal _user;
        private ControllerContext _controllerContext;

        EntityEntry<ApplicationUser> _user1;
        EntityEntry<ApplicationUser> _user2;


        [Test]
        public async Task ShouldGetUsers()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext);
            UserController userController = new UserController(userService);

            List<UserListVm> result = await userController.GetUsersAsync();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(_user1.Entity.Id, result[0].Id);
            Assert.AreEqual(_firstName1, result[0].FirstName);
            Assert.AreEqual(_middleName1, result[0].MiddleName);
            Assert.AreEqual(_lastName1, result[0].LastName);
            Assert.AreEqual(_user2.Entity.Id, result[1].Id);
            Assert.AreEqual(_firstName2, result[1].FirstName);
            Assert.AreEqual(_middleName2, result[1].MiddleName);
            Assert.AreEqual(_lastName2, result[1].LastName);
        }

        [Test]
        public async Task ShouldGetUserById()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext);
            UserController userController = new UserController(userService);

            setUser(userController, _user1.Entity.Id);
            ActionResult<UserVm> result1 = await userController.GetUserAsync();

            UserVm returnedUser1 = result1.Value;
            Assert.AreEqual(_user1.Entity.Id, returnedUser1.Id);
            Assert.AreEqual(_firstName1, returnedUser1.FirstName);
            Assert.AreEqual(_middleName1, returnedUser1.MiddleName);
            Assert.AreEqual(_lastName1, returnedUser1.LastName);
            Assert.AreEqual(_phoneNumber1, returnedUser1.PhoneNumber);
            Assert.AreEqual(_address1, returnedUser1.Address);
            Assert.AreEqual(_email1, returnedUser1.EMail);
            Assert.AreEqual(_userName1, returnedUser1.UserName);

            setUser(userController, _user2.Entity.Id);
            ActionResult<UserVm> result2 = await userController.GetUserAsync();

            UserVm returnedUser2 = result2.Value;
            Assert.AreEqual(_user2.Entity.Id, returnedUser2.Id);
            Assert.AreEqual(_firstName2, returnedUser2.FirstName);
            Assert.AreEqual(_middleName2, returnedUser2.MiddleName);
            Assert.AreEqual(_lastName2, returnedUser2.LastName);
            Assert.AreEqual(_phoneNumber2, returnedUser2.PhoneNumber);
            Assert.AreEqual(_address2, returnedUser2.Address);
            Assert.AreEqual(_email2, returnedUser2.EMail);
            Assert.AreEqual(_userName2, returnedUser2.UserName);
        }

        // Helper methods
        private void CreateUsers()
        {
            _user1 = _dbContext.ApplicationUsers.Add(new ApplicationUser { FirstName = _firstName1, MiddleName = _middleName1, LastName = _lastName1, PhoneNumber = _phoneNumber1, Address = _address1, Email = _email1, UserName = _userName1 });
            _dbContext.SaveChanges();
            _user2 = _dbContext.ApplicationUsers.Add(new ApplicationUser { FirstName = _firstName2, MiddleName = _middleName2, LastName = _lastName2, PhoneNumber = _phoneNumber2, Address = _address2, Email = _email2, UserName = _userName2 });
            _dbContext.SaveChanges();
        }

        private void setUser(UserController userController, String userId)
        {
            _identity = new ClaimsIdentity();
            _identity.AddClaims(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            });
            _user = new ClaimsPrincipal(_identity);
            _controllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = _user } };

            userController.ControllerContext = _controllerContext;
        }
    }
}
