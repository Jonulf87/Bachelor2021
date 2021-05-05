using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;


namespace WarpTest.WebLayer.Controllers
{
    public class CrewControllerTest : BaseTest
    {
        private const string _crewName2 = "Test Crew 2";
        private const string _crewName3 = "Test Crew 3";

        [Test]
        public async Task ShouldGetCrews()
        {
            // Create 2 crews
            await CreateCrew(_crewName2);
            await CreateCrew(_crewName3);

            // Check that the list contains both
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            List<CrewListVm> result = await crewController.GetCrewsAsync();

            // There was already 1 crew from BaseTest + we have created 2 crews
            Assert.AreEqual(3, result.Count);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_crewName2, result[1].Name);
            Assert.AreEqual(3, result[2].Id);
            Assert.AreEqual(_crewName3, result[2].Name);
        }

        [Test]
        public async Task ShouldGetCrewById()
        {
            // Create 2 crews
            await CreateCrew(_crewName2);
            await CreateCrew(_crewName3);

            // Check that we can get both by id
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<CrewVm> result1 = await crewController.GetCrewAsync(2);
            CrewVm returnedCrew1 = result1.Value;
            Assert.AreEqual(2, returnedCrew1.CrewId);
            Assert.AreEqual(_crewName2, returnedCrew1.CrewName);

            ActionResult<CrewVm> result2 = await crewController.GetCrewAsync(3);
            CrewVm returnedCrew2 = result2.Value;
            Assert.AreEqual(3, returnedCrew2.CrewId);
            Assert.AreEqual(_crewName3, returnedCrew2.CrewName);
        }

        [Test]
        public void ShouldNotGetCrewByIdIfDoesntExist()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);
            
            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<CrewVm> result = await crewController.GetCrewAsync(123);
            });
            Assert.That(ex.Message == "Fant ikke arbeidslaget");
        }

        [Test]
        public async Task ShouldNotCreateCrewIfNameAlreadyUsed()
        {
            await CreateCrew(_crewName2);

            ActionResult<CrewVm> result = await CreateCrew(_crewName2);
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestResult)result.Result).StatusCode);
        }

        [Test]
        public async Task ShouldUpdateCrewName()
        {
            // Create 2 crews
            await CreateCrew(_crewName2);
            await CreateCrew(_crewName3);

            // Update one
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewNewData = new CrewVm
            {
                CrewId = 2,
                CrewName = "New Name"
            };

            await crewController.UpdateCrewAsync(crewNewData);

            // Check that only one has been changed
            Crew crew1 = _dbContext.Crews.Find(2);
            Assert.AreEqual(crewNewData.CrewName, crew1.Name);

            Crew crew2 = _dbContext.Crews.Find(3);
            Assert.AreEqual(crew2.Name, _crewName3);
        }

        [Test]
        public async Task ShouldNotUpdateCrewIfDoesntExist()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            StatusCodeResult result = (StatusCodeResult)await crewController.UpdateCrewAsync(new CrewVm { CrewId = 123, CrewName = "New Name" });
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Test]
        public async Task ShouldDeleteCrew()
        {
            // Create 2 crews
            await CreateCrew(_crewName2);
            await CreateCrew(_crewName3);

            // Delete the first
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            CrewVm crewVm = new CrewVm
            {
                CrewId = 2
            };

            await crewController.DeleteCrewAsync(crewVm);

            // Check that we have deleted only one
            // Check that the others still has data
            Crew crew1 = _dbContext.Crews.Find(1);
            Assert.IsNotNull(crew1);
            Crew crew2 = _dbContext.Crews.Find(2);
            Assert.IsNull(crew2);
            Crew crew3 = _dbContext.Crews.Find(3);
            Assert.IsNotNull(crew3);
            Assert.AreEqual(_crewName3, crew3.Name);
        }

        [Test]
        public async Task ShouldNotDeleteCrewIfDoesntExist()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            StatusCodeResult result = (StatusCodeResult)await crewController.DeleteCrewAsync(new CrewVm { CrewId = 123, CrewName = "New Name" });
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
        }
        

        [Test]
        public async Task ShouldGetCrewMembers()
        {
            Crew crew1 = _dbContext.Crews.Find(1);

            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewMembersAsync(crew1.Id);
            List<CrewMembersListVm> returnedCrewMembers = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, returnedCrewMembers.Count);
            Assert.AreEqual(_createdUser1.Entity.Id, returnedCrewMembers[0].Id);
        }
        

        [Test]
        public async Task ShouldNotGetCrewMembersFromCrewWithInvalidId()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewMembersAsync(123);
            Assert.AreEqual((int)HttpStatusCode.NotFound, ((NotFoundObjectResult)result.Result).StatusCode);
        }


        [Test]
        public async Task ShouldAddCrewMember()
        {
            await CreateCrew(_crewName2);
            Crew crew2 = _dbContext.Crews.Find(2);
            CrewUser crewUser = _dbContext.CrewUsers.Find(1);

            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewMembersAsync(crew2.Id);
            List<CrewMembersListVm> returnedCrewMembers = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;
            Assert.AreEqual(0, returnedCrewMembers.Count);

            await crewController.AddCrewMemberAsync(crew2.Id, _createdUser1.Entity.Id);

            result = await crewController.GetCrewMembersAsync(crew2.Id);
            returnedCrewMembers = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;
            Assert.AreEqual(1, returnedCrewMembers.Count);
            Assert.AreEqual(_createdUser1.Entity.Id, returnedCrewMembers[0].Id);
        }

        [Test]
        public async Task ShouldGetCrewLeders()
        {
            Crew crew1 = _dbContext.Crews.Find(1);

            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewLeadersAsync(crew1.Id);
            List<CrewMembersListVm> returnedCrewLeaders = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, returnedCrewLeaders.Count);
            Assert.AreEqual(_createdUser2.Entity.Id, returnedCrewLeaders[0].Id);
        }

        [Test]
        public async Task ShouldNotGetCrewLeadersFromCrewWithInvalidId()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewLeadersAsync(123);
            Assert.AreEqual((int)HttpStatusCode.NotFound, ((NotFoundObjectResult)result.Result).StatusCode);
        }

        [Test]
        public async Task ShouldAddCrewLeader()
        {
            await CreateCrew(_crewName2);
            Crew crew2 = _dbContext.Crews.Find(2);

            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);

            ActionResult<List<CrewMembersListVm>> result = await crewController.GetCrewLeadersAsync(crew2.Id);
            List<CrewMembersListVm> returnedCrewLeaders = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;
            Assert.AreEqual(0, returnedCrewLeaders.Count);

            await crewController.AddCrewLeaderAsync(crew2.Id, _createdUser2.Entity.Id);

            result = await crewController.GetCrewLeadersAsync(crew2.Id);
            returnedCrewLeaders = (List<CrewMembersListVm>)((OkObjectResult)result.Result).Value;
            Assert.AreEqual(1, returnedCrewLeaders.Count);
            Assert.AreEqual(_createdUser2.Entity.Id, returnedCrewLeaders[0].Id);
        }

        [Test]
        public async Task ShouldCheckIfAUserIsAMemberOfACrew()
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);
            SetUser(crewController, _createdUser1.Entity.Id);

            ActionResult<List<CrewListVm>> result = await crewController.GetCrewsUserIsMemberOfAsync();
            List<CrewListVm> returnedCrewLeaders = (List<CrewListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, returnedCrewLeaders.Count);
            Assert.AreEqual(1, returnedCrewLeaders[0].Id);
        }

        // Helper methods
        private async Task<ActionResult> CreateCrew(string crewName)
        {
            CrewService crewService = new CrewService(_dbContext, _mainEventProvider);
            CrewController crewController = new CrewController(crewService);
            SetUser(crewController, _createdUser1.Entity.Id);

            return await crewController.CreateCrewAsync(crewName);
        }
    }
}
