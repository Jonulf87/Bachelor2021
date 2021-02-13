using IdentityServer4.EntityFramework.Options;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using System.Data.Common;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace WarpTest.WebLayer.Controllers
{
    public class BaseTest
    {
        protected DbConnection _connection;
        protected DbContextOptions _options;
        protected ApplicationDbContext _dbContext;

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

            _dbContext.SaveChangesAsync();
        }
    }
}
