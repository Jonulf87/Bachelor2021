using IdentityServer4.EntityFramework.Options;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace WarpTest.WebLayer.RestAPI
{
    class DatabaseFixture : IDisposable
    {
        protected DbConnection _connection;
        protected DbContextOptions _options;
        //protected ApplicationDbContext _dbContext;

        public DatabaseFixture()
        {
            _connection = new SqliteConnection("Data Source=:memory:");

            _connection.Open();

            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;

            //_dbContext = new ApplicationDbContext(_options, Options.Create<OperationalStoreOptions>(new OperationalStoreOptions()));
            //_dbContext.Database.EnsureDeleted();
            //_dbContext.Database.EnsureCreated();

            //_dbContext.CrewRoles.Add(new CrewUser { Id = 1, Description = "Test Rolle 1" });
            //_dbContext.CrewRoles.Add(new CrewUser { Id = 2, Description = "Test Rolle 2" });
            //_dbContext.CrewRoles.Add(new CrewUser { Id = 3, Description = "Test Rolle 3" });

            //_dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}
