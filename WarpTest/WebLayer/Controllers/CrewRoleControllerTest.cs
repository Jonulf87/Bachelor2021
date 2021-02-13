using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WarpTest.WebLayer.Controllers
{
    class CrewRoleControllerTest : BaseTest
    {
        [Test]
        public async Task ShouldGetCrewRoles()
        {
            CrewRoleService crewRoleService = new CrewRoleService(_dbContext);
            CrewRoleController crewRoleController = new CrewRoleController(crewRoleService);

            // 3 roles have been added in CreateInMemoryDatabase() in BaseTest

            List<CrewRoleListVm> result = await crewRoleController.GetCrewRoles();

            Assert.AreEqual(3, result.Count);
            Assert.AreEqual(1, result[0].CrewRoleId);
            Assert.AreEqual(2, result[1].CrewRoleId);
            Assert.AreEqual(3, result[2].CrewRoleId);
        }

        [Test]
        public async Task ShouldGetCrewRoleById()
        {
            CrewRoleService crewRoleService = new CrewRoleService(_dbContext);
            CrewRoleController crewRoleController = new CrewRoleController(crewRoleService);

            ActionResult<CrewRoleVm> result1 = await crewRoleController.GetCrewRole(1);
            CrewRoleVm returnedCrewRole1 = result1.Value;
            Assert.AreEqual(1, returnedCrewRole1.CrewRoleId);
            Assert.AreEqual("Test Rolle 1", returnedCrewRole1.Description);

            ActionResult<CrewRoleVm> result2 = await crewRoleController.GetCrewRole(2);
            CrewRoleVm returnedCrewRole2 = result2.Value;
            Assert.AreEqual(2, returnedCrewRole2.CrewRoleId);
            Assert.AreEqual("Test Rolle 2", returnedCrewRole2.Description);
        }


        // Helper methods
        // await crewRoleController.CreateCrewRole(new CrewRoleVm { Description = "Test role 1" });
        // await crewRoleController.CreateCrewRole(new CrewRoleVm { Description = "Test role 2" });
        // await crewRoleController.CreateCrewRole(new CrewRoleVm { Description = "Test role 3" });
    }
}
