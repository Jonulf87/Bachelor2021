using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class CrewRoleControllerTest : BaseTest
    {
        private const string _descr = "New description";

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

            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(2)
            };
            Crew crew = new Crew
            {
                CrewName = "Crew Name",
                CrewRoles = crewRoles
            };

            _dbContext.Crews.Add(crew);
            _dbContext.SaveChanges();

            ActionResult<CrewRoleVm> result1 = await crewRoleController.GetCrewRole(1);
            CrewRoleVm returnedCrewRole1 = result1.Value;
            Assert.AreEqual(1, returnedCrewRole1.CrewRoleId);
            Assert.AreEqual("Test Rolle 1", returnedCrewRole1.Description);
            Assert.AreEqual(0, returnedCrewRole1.Crews.Count);

            ActionResult<CrewRoleVm> result2 = await crewRoleController.GetCrewRole(2);
            CrewRoleVm returnedCrewRole2 = result2.Value;
            Assert.AreEqual(2, returnedCrewRole2.CrewRoleId);
            Assert.AreEqual("Test Rolle 2", returnedCrewRole2.Description);
            Assert.AreEqual(1, returnedCrewRole2.Crews.Count);
        }

        [Test]
        public async Task ShouldCreateCrewRole()
        {
            ActionResult<CrewRoleVm> result = await CreateCrewRole(_descr);

            CrewRoleVm createdCrewRole = (CrewRoleVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(4, createdCrewRole.CrewRoleId);
            Assert.AreEqual(_descr, createdCrewRole.Description);
            Assert.IsNull(createdCrewRole.Crews);

            // Check what we really have in the DB
            CrewRole crewRole1 = _dbContext.CrewRoles.Find(4);
            Assert.AreEqual(4, crewRole1.CrewRoleId);
            Assert.AreEqual(_descr, crewRole1.Description);
            Assert.IsNull(crewRole1.Crews);
        }

        [Test]
        public async Task ShouldUpdateCrewRole()
        {
            CrewRoleService crewRoleService = new CrewRoleService(_dbContext);
            CrewRoleController crewRoleController = new CrewRoleController(crewRoleService);

            CrewRoleVm newCrewRole1 = new CrewRoleVm
            {
                CrewRoleId = 1,
                Description = _descr
            };

            await crewRoleController.UpdateCrewRole(newCrewRole1);

            // Check that only one has been changed
            CrewRole crewRole1 = _dbContext.CrewRoles.Find(1);
            Assert.AreEqual(_descr, crewRole1.Description);

            CrewRole crewRole2 = _dbContext.CrewRoles.Find(2);
            Assert.AreEqual("Test Rolle 2", crewRole2.Description);
        }

        [Test]
        public async Task ShouldDeleteCrewRole()
        {
            CrewRoleService crewRoleService = new CrewRoleService(_dbContext);
            CrewRoleController crewRoleController = new CrewRoleController(crewRoleService);

            CrewRoleVm crewRoleVm = new CrewRoleVm
            {
                CrewRoleId = 1
            };

            ActionResult<CrewRoleVm> result = await crewRoleController.DeleteCrewRole(crewRoleVm);
            CrewRoleVm deletedCrewRole = (CrewRoleVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedCrewRole.CrewRoleId);

            // Check that we have deleted only the first, but not the others
            CrewRole crewRole1 = _dbContext.CrewRoles.Find(1);
            Assert.IsNull(crewRole1);
            CrewRole crewRole2 = _dbContext.CrewRoles.Find(2);
            Assert.IsNotNull(crewRole2);
            CrewRole crewRole3 = _dbContext.CrewRoles.Find(3);
            Assert.IsNotNull(crewRole3);
        }


        // Helper methods
        private async Task<ActionResult<CrewRoleVm>> CreateCrewRole(string description)
        {
            CrewRoleService crewRoleService = new CrewRoleService(_dbContext);
            CrewRoleController crewRoleController = new CrewRoleController(crewRoleService);

            CrewRoleVm crewRoleVm = new CrewRoleVm
            {
                Description = description
            };

            return await crewRoleController.CreateCrewRole(crewRoleVm);
        }


    }
}
