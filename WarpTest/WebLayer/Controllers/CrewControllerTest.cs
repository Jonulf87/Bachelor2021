using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    public class Tests
    {
        private const string _crewName = "Test";

        private DbConnection _connection;
        private DbContextOptions _options;
        ApplicationDbContext _dbContext;

        [SetUp]
        public void Setup()
        {
            CreateInMemoryDatabase();
        }

        [TearDown]
        public void TearDown()
        {
            _connection.Dispose();
        }

        private void CreateInMemoryDatabase()
        {
            _connection = new SqliteConnection("Filename=:memory:");

            _connection.Open();

            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;

            _dbContext = new ApplicationDbContext(_options, Options.Create<OperationalStoreOptions>(new OperationalStoreOptions()));
            _dbContext.Database.EnsureDeleted();
            _dbContext.Database.EnsureCreated();

            _dbContext.CrewRoles.Add(new CrewRole { CrewRoleId = 1, Description = "Test Rolle 1" });
            _dbContext.CrewRoles.Add(new CrewRole { CrewRoleId = 2, Description = "Test Rolle 2" });
            _dbContext.CrewRoles.Add(new CrewRole { CrewRoleId = 3, Description = "Test Rolle 3" });
        }


        [Test]
        public async Task CreateCrewWithNoRoles()
        {
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            List<CrewRole> crewRoles = new List<CrewRole>
            {
            };

            CrewVm crewVm = new CrewVm
            {
                CrewName = _crewName,
                CrewRoles = crewRoles
            };

            ActionResult<CrewVm> result = await crewController.CreateCrew(crewVm);
            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(createdCrew.CrewId, 1);
            Assert.AreEqual(createdCrew.CrewName, _crewName);
            Assert.AreEqual(createdCrew.CrewRoles.Count, 0);
        }

        [Test]
        public async Task CreateCrewWithOneRole()
        {
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(2)
            };

            CrewVm crewVm = new CrewVm
            {
                CrewName = _crewName,
                CrewRoles = crewRoles
            };

            ActionResult<CrewVm> result = await crewController.CreateCrew(crewVm);
            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(createdCrew.CrewId, 1);
            Assert.AreEqual(createdCrew.CrewName, _crewName);
            Assert.AreEqual(createdCrew.CrewRoles.Count, 1);
            Assert.AreEqual(((IList<CrewRole>)createdCrew.CrewRoles)[0].CrewRoleId, 2);
        }

        [Test]
        public async Task CreateCrewWithManyRoles()
        {
            CrewService crewService = new CrewService(_dbContext);
            CrewController crewController = new CrewController(crewService);

            List<CrewRole> crewRoles = new List<CrewRole>
            {
                _dbContext.CrewRoles.Find(1),
                _dbContext.CrewRoles.Find(2),
                _dbContext.CrewRoles.Find(3)
            };

            CrewVm crewVm = new CrewVm
            {
                CrewName = _crewName,
                CrewRoles = crewRoles
            };

            ActionResult<CrewVm> result = await crewController.CreateCrew(crewVm);
            CrewVm createdCrew = (CrewVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(createdCrew.CrewId, 1);
            Assert.AreEqual(createdCrew.CrewName, _crewName);
            Assert.AreEqual(createdCrew.CrewRoles.Count, 3);
            Assert.AreEqual(((IList<CrewRole>)createdCrew.CrewRoles)[0].CrewRoleId, 1);
            Assert.AreEqual(((IList<CrewRole>)createdCrew.CrewRoles)[1].CrewRoleId, 2);
            Assert.AreEqual(((IList<CrewRole>)createdCrew.CrewRoles)[2].CrewRoleId, 3);
        }
    }
}
