using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class SecurityControllerTest : BaseTest
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private UserManager<ApplicationUser> _userManager;
        private SecurityController _securityController;
        private SecurityService _securityService;
        Crew _crew;

        [SetUp]
        public async Task LocalSetup()
        {
            var serviceProvider = new ServiceCollection().AddLogging().BuildServiceProvider();
            var logger = serviceProvider.GetService<ILoggerFactory>().CreateLogger<UserManager<ApplicationUser>>();

            UserStore<ApplicationUser> store = new UserStore<ApplicationUser>(_dbContext);
            _userManager = new UserManager<ApplicationUser>(store, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, logger);

            _securityService = new SecurityService(_dbContext, _userManager, _roleManager);
            _securityController = new SecurityController(_securityService);
            SetUser(_securityController, _createdUser2.Entity.Id);
            _crew = _dbContext.Crews.Find(1);

            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);
            await crewController.AddCrewLeaderAsync(_crew.Id, _createdUser2.Entity.Id);

            await _securityController.SetPoliciesAsync(
                new List<CrewPermissionsVm> {
                    new CrewPermissionsVm { Name = "CheckInAdmin", Value = 0, CrewHasPermission = true },
                    new CrewPermissionsVm { Name = "CrewAdmin", Value = 1, CrewHasPermission = true }
                },
                _crew.Id
            );
        }

        [Test]
        public async Task ShouldSetAndGetPolicies()
        {
            ActionResult<List<CrewPermissionType>> result = await _securityController.GetPoliciesAsync();
            List<CrewPermissionType> crewPermissions = (List<CrewPermissionType>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(2, crewPermissions.Count);
            Assert.That(crewPermissions, Has.Exactly(1).Matches<CrewPermissionType>(permission => permission == CrewPermissionType.CheckInAdmin));
            Assert.That(crewPermissions, Has.Exactly(1).Matches<CrewPermissionType>(permission => permission == CrewPermissionType.CrewAdmin));
        }


        [Test]
        public async Task ShouldGetAllPolicies()
        {
            ActionResult<List<CrewPermissionsVm>> result = await _securityController.GetAllPoliciesAsync(_crew.Id);
            List<CrewPermissionsVm> crewPermissions = result.Value;

            Assert.AreEqual(8, crewPermissions.Count);
            Assert.AreEqual(crewPermissions[0].Name, "CheckInAdmin");
            Assert.AreEqual(crewPermissions[1].Name, "CrewAdmin");
            Assert.AreEqual(crewPermissions[2].Name, "TicketAdmin");
            Assert.AreEqual(crewPermissions[3].Name, "SeatMapAdmin");
            Assert.AreEqual(crewPermissions[4].Name, "UserAdmin");
            Assert.AreEqual(crewPermissions[5].Name, "ReportAdmin");
            Assert.AreEqual(crewPermissions[6].Name, "VenueAdmin");
            Assert.AreEqual(crewPermissions[7].Name, "ParticipantAdmin");
        }

        [Test]
        public async Task ShouldSetUserEmail()
        {
            await _securityController.SetUserEmailAsync(new UserEmailUpdateVm { UserId = _createdUser2.Entity.Id, NewEMail = "newEmail@test.no"});

            UserService userService = new UserService(_dbContext, _userManager, _mainEventProvider, _securityService);
            UserController userController = new UserController(userService, _securityService);

            ActionResult<UserVm> result = await userController.GetUserAsync(_createdUser2.Entity.Id);
            UserVm returnedUser = result.Value;

            Assert.AreEqual(returnedUser.EMail, "newEmail@test.no");
        }

    }
}
