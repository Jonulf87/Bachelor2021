using System;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Interfaces;
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
        private readonly DateTime _dateOfBirth3 = DateTime.Now.AddYears(-20);
        // These are not really used (and can be null), but we need these objects as params for UserService and SecurityService
        private UserManager<ApplicationUser> _userManager;
        private SecurityService _securityService;
        private readonly RoleManager<IdentityRole> _roleManager;

        EntityEntry<ApplicationUser> _createdUser3;

        [SetUp]
        public void LocalSetup()
        {
            var serviceProvider = new ServiceCollection().AddLogging().BuildServiceProvider();
            var logger = serviceProvider.GetService<ILoggerFactory>().CreateLogger<UserManager<ApplicationUser>>();

            UserStore<ApplicationUser> store = new UserStore<ApplicationUser>(_dbContext);
            _userManager = new UserManager<ApplicationUser>(store, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, logger);

            _securityService = new SecurityService(_dbContext, _userManager, _roleManager);
        }

        [Test]
        public async Task ShouldGetUsers()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, _createdUser2.Entity.Id);

            ActionResult<List<UserListVm>> resultAr = await userController.GetUsersAsync();
            List<UserListVm> result = resultAr.Value;

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
        public async Task ShouldGetAllUsers()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, _createdUser2.Entity.Id);

            ActionResult<List<UserPickerVm>> result = await userController.GetAllUsersAsync();
            var users = result.Value;

            Assert.AreEqual(3, users.Count);
            Assert.AreEqual(_createdUser1.Entity.Id, users[0].Id);
            Assert.AreEqual(_createdUser1.Entity.FirstName, users[0].FirstName);
            Assert.AreEqual(_createdUser1.Entity.LastName, users[0].LastName);
            Assert.AreEqual(_createdUser2.Entity.Id, users[1].Id);
            Assert.AreEqual(_createdUser2.Entity.FirstName, users[1].FirstName);
            Assert.AreEqual(_createdUser2.Entity.LastName, users[1].LastName);
            Assert.AreEqual(_createdUser3.Entity.Id, users[2].Id);
            Assert.AreEqual(_createdUser3.Entity.FirstName, users[2].FirstName);
            Assert.AreEqual(_createdUser3.Entity.LastName, users[2].LastName);
        }

       
        [Test]
        public async Task ShouldUpdateUserName()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            UsernameUpdateVm userForUpdate = new UsernameUpdateVm
            {
                Username = "New user name"
            };

            await userController.UpdateUsernameAsync(userForUpdate);

            ApplicationUser updatedUser = _dbContext.Users.Find(_createdUser2.Entity.Id);
            Assert.AreEqual(userForUpdate.Username, updatedUser.UserName);
        }

        [Test]
        public void ShouldNotUpdateUserNameIfNotFound()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, "123456");

            UsernameUpdateVm userForUpdate = new UsernameUpdateVm
            {
                Username = "New user name"
            };

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                await userController.UpdateUsernameAsync(userForUpdate);
            });
            Assert.AreEqual("Fant ingen bruker med denne ID'en", ex.Message);
        }

        [Test]
        public async Task ShouldUpdateEmail()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            EMailUpdateVm dataForUpdate = new EMailUpdateVm
            {
                EMail = "newEmail@test.no"
            };

            await userController.UpdateEMailAsync(dataForUpdate);

            ApplicationUser updatedUser = _dbContext.Users.Find(_createdUser2.Entity.Id);
            Assert.AreEqual(dataForUpdate.EMail, updatedUser.Email);
        }

        [Test]
        public void ShouldNotUpdateEmaleIfNotFound()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, "123456");

            EMailUpdateVm dataForUpdate = new EMailUpdateVm
            {
                EMail = "newEmail@test.no"
            };

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                await userController.UpdateEMailAsync(dataForUpdate);
            });
            Assert.AreEqual("Fant ingen bruker med denne ID'en", ex.Message);
        }

        [Test]
        public async Task ShouldUpdatePassword()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            var oldPassword = "OldPassword123456788";
            var newPassword = "NewPassword123456788";

            // Now we have to create password for this user
            // HashPassword-method needs already existing user, so we create password only AFTER we have created the user
            // The user is already created in BaseTest
            var hasher = new PasswordHasher<ApplicationUser>();
            var hash = hasher.HashPassword(_createdUser2.Entity, oldPassword);
            _createdUser2.Entity.PasswordHash = hash;
            _dbContext.SaveChanges();

            SetUser(userController, _createdUser2.Entity.Id);

            PasswordUpdateVm dataForUpdate = new PasswordUpdateVm
            {
               OldPassword = oldPassword,
               NewPassword = newPassword,
               CheckNewPassword = newPassword
            };

            await userController.UpdatePasswordAsync(dataForUpdate);

            ApplicationUser updatedUser = _dbContext.Users.Find(_createdUser2.Entity.Id);
           
            Assert.AreNotEqual(hash, updatedUser.PasswordHash);
        }

        [Test]
        public void ShouldNotUpdatePasswordIfIncorrect()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            PasswordUpdateVm dataForUpdate = new PasswordUpdateVm
            {
                OldPassword = "WrongPassword",
                NewPassword = "NewPassword3747466",
                CheckNewPassword = "NewPassword3747466"
            };

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                await userController.UpdatePasswordAsync(dataForUpdate);
            });
            Assert.AreEqual("Det gamle passordet er ugyldig", ex.Message);
        }

        [Test]
        public async Task ShouldCheckUserName()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            var result = await userController.CheckUserNameAsync("UserName");
            var available = result.Value;

            Assert.IsFalse(available.IsUnavailable);

            result = await userController.CheckUserNameAsync(_createdUser2.Entity.UserName);
            available = result.Value;

            Assert.IsTrue(available.IsUnavailable);
        }

        [Test]
        public async Task ShouldCheckEmail()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            SetUser(userController, _createdUser2.Entity.Id);

            var result = await userController.CheckEMailAsync("UserName@test.no");
            var available = result.Value;

            Assert.IsFalse(available.IsUnavailable);

            result = await userController.CheckEMailAsync(_createdUser2.Entity.Email);
            available = result.Value;

            Assert.IsTrue(available.IsUnavailable);
        }

        [Test]
        public void ShouldNotGetUsersIfNotAdmin()
        {
            CreateUsers();

            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, _createdUser3.Entity.Id);

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<List<UserListVm>> resultAr = await userController.GetUsersAsync();
            });
            Assert.AreEqual("Du har ikke tilgang til denne listen", ex.Message);
        }

        [Test]
        public async Task ShouldGetCurrentUser()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

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

            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

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
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, _createdUser2.Entity.Id);

            UserUpdateVm userForUpdate = new UserUpdateVm
            {
                LastName = "Svensen"
            };

            await userController.UpdateUserAsync(userForUpdate);

            ApplicationUser updatedUser = _dbContext.Users.Find(_createdUser2.Entity.Id);
            Assert.AreEqual(userForUpdate.LastName, updatedUser.LastName);


        }


        [Test]
        public void ShouldNotUpdateUserWithInvalidId()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, "1234567890");

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<CrewVm> result = await userController.UpdateUserAsync(new UserUpdateVm
                {
                    FirstName = "Oda",
                    LastName = "Svensen"
                });
            });
            Assert.AreEqual("Fant ingen bruker med navn: Oda Svensen", ex.Message);
        }

        [Test]
        public async Task ShouldRegisterUser()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);
            SetUser(userController, _createdUser2.Entity.Id);

            UserVm newUser = new UserVm
            {
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

            await userController.RegisterUserAsync(newUser);

            ActionResult<List<UserListVm>> newResultAr = await userController.GetUsersAsync();
            List<UserListVm> newResult = newResultAr.Value;

            Assert.AreEqual(3, newResult.Count);
            Assert.That(
                newResult,
                Has.Exactly(1).Matches<UserListVm>(
                    user => user.FirstName == newUser.FirstName &&
                    user.MiddleName == newUser.MiddleName &&
                    user.LastName == newUser.LastName &&
                    user.EMail == newUser.EMail &&
                    user.UserName == newUser.UserName &&
                    user.PhoneNumber == newUser.PhoneNumber &&
                    user.DateOfBirth == newUser.DateOfBirth
                )
            );
        }

        [Test]
        public void ShouldNorRegisterUserIfAlreadyRegistered()
        {
            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            UserVm newUser = new UserVm
            {
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
                EMail = "Line@test.no",
                UserName = "AnnaSvensen",
                Password = "PassWord"
            };

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                await userController.RegisterUserAsync(newUser);
            });
            Assert.AreEqual("Bruker med e-post Line@test.no eksisterer allerede", ex.Message);

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
                DateOfBirth = _dateOfBirth3,
                Email = _email3,
                UserName = _userName3,
                PhoneNumber = _phone3
            });

            _dbContext.SaveChanges();
        }
    }
}
