using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    public class CrewControllerTest : BaseTest
    {
        private const string _crewName1 = "Test Crew 1";
        private const string _crewName2 = "Test Crew 2";

        [Test]
        public async Task ShouldGetCrews()
        {
            List<CrewRole> crewRoles = new List<CrewRole>
            {
            };

            // Create 2 crew members
            await CreateCrew(crewRoles, _crewName1);
            await CreateCrew(crewRoles, _crewName2);

            // Check that the list contains both
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            List<CrewListVm> result = await crewController.GetCrews();

            Assert.AreEqual(result.Count, 2);
            Assert.AreEqual(result[0].CrewId, 1);
            Assert.AreEqual(result[0].CrewName, _crewName1);
            Assert.AreEqual(result[1].CrewId, 2);
            Assert.AreEqual(result[1].CrewName, _crewName2);
        }

        [Test]
        public async Task ShouldGetCrewById()
        {
            List<CrewRole> crewRoles1 = new List<CrewRole>
            {
            };

            List<CrewRole> crewRoles2 = new List<CrewRole>
            {
                 _dbContext.CrewRoles.Find(1)
            };

            // Create 2 different crew members
            await CreateCrew(crewRoles1, _crewName1);
            await CreateCrew(crewRoles2, _crewName2);

            // Check that we can get both by id
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            ActionResult<CrewVm> result1 = await crewController.GetCrew(1);
            CrewVm returnedCrew1 = result1.Value;
            Assert.AreEqual(returnedCrew1.CrewId, 1);
            Assert.AreEqual(returnedCrew1.CrewName, _crewName1);
            Assert.AreEqual(returnedCrew1.CrewRoles.Count, 0);

            ActionResult<CrewVm> result2 = await crewController.GetCrew(2);
            CrewVm returnedCrew2 = result2.Value;
            Assert.AreEqual(returnedCrew2.CrewId, 2);
            Assert.AreEqual(returnedCrew2.CrewName, _crewName2);
            Assert.AreEqual(returnedCrew2.CrewRoles.Count, 1);
        }

        [Test]
        public async Task ShouldCreateCrewWithNoRoles()
        {
            List<CrewRole> crewRoles = new List<CrewRole>
            {
            };

            ActionResult<CrewVm> result = await CreateCrew(crewRoles);

            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            CheckCreatedCrew(createdCrew, crewRoles);
        }

        [Test]
        public async Task ShouldCreateCrewWithOneRole()
        {
            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(2)
            };

            ActionResult<CrewVm> result = await CreateCrew(crewRoles);

            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            CheckCreatedCrew(createdCrew, crewRoles);
        }

        [Test]
        public async Task ShouldCreateCrewWithManyRoles()
        {
            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(1),
                _dbContext.CrewRoles.Find(2),
                _dbContext.CrewRoles.Find(3)
            };

            ActionResult<CrewVm> result = await CreateCrew(crewRoles);

            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            CheckCreatedCrew(createdCrew, crewRoles);
        }

        [Test]
        public async Task ShouldUpdateCrewName()
        {
            List<CrewRole> crewRoles1 = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(1),
                _dbContext.CrewRoles.Find(2),
                _dbContext.CrewRoles.Find(3)
            };

            List<CrewRole> crewRoles2 = new List<CrewRole>
            {
            };

            // Create 2 crew members
            await CreateCrew(crewRoles1, _crewName1);
            await CreateCrew(crewRoles2, _crewName2);

            // Update one
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewNewData = new CrewVm
            {
                CrewId = 1,
                CrewName = "New Name"
            };

            await crewController.UpdateCrew(crewNewData);

            // Check that only one has been changed
            Crew crew1 = _dbContext.Crews.Find(1);
            Assert.AreEqual(crewNewData.CrewName, crew1.CrewName);
            CollectionAssert.AreEquivalent(crewRoles1, crew1.CrewRoles);

            Crew crew2 = _dbContext.Crews.Find(2);
            Assert.AreEqual(_crewName2, crew2.CrewName);
            CollectionAssert.AreEquivalent(crewRoles2, crew2.CrewRoles);
        }

        [Test]
        public async Task ShouldUpdateCrewRole()
        {
            List<CrewRole> crewRoles1 = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(1),
                _dbContext.CrewRoles.Find(2),
                _dbContext.CrewRoles.Find(3)
            };

            List<CrewRole> crewRoles2 = new List<CrewRole>
            {
            };

            List<CrewRole> newCrewRoles2 = new List<CrewRole>
                {
                    _dbContext.CrewRoles.Find(3)
                };

            // Create 2 crew members
            await CreateCrew(crewRoles1, _crewName1);
            await CreateCrew(crewRoles2, _crewName2);

            // Update one
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewNewData = new CrewVm
            {
                CrewId = 2,
                CrewRoles = newCrewRoles2
            };

            await crewController.UpdateCrew(crewNewData);

            // Check that only one has been changed
            Crew crew1 = _dbContext.Crews.Find(1);
            Assert.AreEqual(_crewName1, crew1.CrewName);
            Assert.AreEqual(crewRoles1, crew1.CrewRoles);

            Crew crew2 = _dbContext.Crews.Find(2);
            Assert.AreEqual(_crewName2, crew2.CrewName);
            Assert.AreEqual(newCrewRoles2, crew2.CrewRoles);
        }

        [Test]
        public async Task ShouldDeleteCrew()
        {
            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(2)
            };

            // Create 2 crew members
            await CreateCrew(crewRoles);
            await CreateCrew(crewRoles);

            // Delete the first
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewVm = new CrewVm
            {
                CrewId = 1
            };

            ActionResult<CrewVm> result = await crewController.DeleteCrew(crewVm);
            CrewVm deletedCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            // Check that we have deleted only the first, but not the second
            // Check that the second still has data
            Assert.AreEqual(deletedCrew.CrewId, 1);

            Crew crew1 = _dbContext.Crews.Find(1);
            Assert.IsNull(crew1);
            Crew crew2 = _dbContext.Crews.Find(2);
            Assert.IsNotNull(crew2);
            Assert.AreEqual(_crewName1, crew2.CrewName);
            Assert.AreEqual(crewRoles, crew2.CrewRoles);
        }


        // Helper methods
        private async Task<ActionResult<CrewVm>> CreateCrew(List<CrewRole> crewRoles)
        {
            return await CreateCrew(crewRoles, _crewName1);
        }

        private async Task<ActionResult<CrewVm>> CreateCrew(List<CrewRole> crewRoles, string crewName)
        {
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewVm = new CrewVm
            {
                CrewName = crewName,
                CrewRoles = crewRoles
            };

            return await crewController.CreateCrew(crewVm);
        }

        private void CheckCreatedCrew(CrewVm createdCrew, List<CrewRole> crewRoles)
        {
            // Check object that is returned from the controller
            Assert.AreEqual(createdCrew.CrewId, 1);
            Assert.AreEqual(createdCrew.CrewName, _crewName1);
            Assert.AreEqual(createdCrew.CrewRoles.Count, crewRoles.Count);

            for (var i = 0; i < crewRoles.Count; i++)
            {
                Assert.AreEqual(((IList<CrewRole>)createdCrew.CrewRoles)[i].CrewRoleId, crewRoles[i].CrewRoleId);
            }

            // Check what we really have in the DB
            Crew crew1 = _dbContext.Crews.Find(1);
            Assert.AreEqual(crew1.CrewId, 1);
            Assert.AreEqual(crew1.CrewName, _crewName1);
            Assert.AreEqual(crew1.CrewRoles.Count, crewRoles.Count);

            for (var i = 0; i < crewRoles.Count; i++)
            {
                Assert.AreEqual(((IList<CrewRole>)crew1.CrewRoles)[i].CrewRoleId, crewRoles[i].CrewRoleId);
            }
        }
    }
}
