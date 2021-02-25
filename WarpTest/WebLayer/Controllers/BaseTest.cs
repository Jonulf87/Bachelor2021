using System.Data.Common;
using System.Security.Claims;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace WarpTest.WebLayer.Controllers
{
    public class BaseTest
    {
        protected DbConnection _connection;
        protected DbContextOptions _options;
        protected ApplicationDbContext _dbContext;
        protected ClaimsIdentity _identity;
        protected ClaimsPrincipal _currentUser;
        protected ControllerContext _controllerContext;

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

        protected void SetUser(ControllerBase controller, string userId)
        {
            _identity = new ClaimsIdentity();
            _identity.AddClaims(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            });
            _currentUser = new ClaimsPrincipal(_identity);
            _controllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = _currentUser } };

            controller.ControllerContext = _controllerContext;
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

            _dbContext.SaveChangesAsync();
        }
    }
}
