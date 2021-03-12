using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Data.Common;
using System.Linq;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.WebLayer;

namespace WarpTest.WebLayer.RestAPI
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(ConfigureServices);
        }

        private void ConfigureServices(WebHostBuilderContext webHostBuilderContext, IServiceCollection serviceCollection)
        {
            ServiceDescriptor dbContextService = serviceCollection.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (dbContextService != null)
            {
                // Remove the DbContext that we have in Startup.cs
                serviceCollection.Remove(dbContextService);
            }

            // Register the new DbContext (SQLite in-memory DB)
            // .NET Core dependency injection framework will now use the this instance.
            DbConnection dbConnection = new SqliteConnection("DataSource=:memory:");
            serviceCollection.AddDbContext<ApplicationDbContext>(contextOptions => contextOptions.UseSqlite(dbConnection));

            // (Re)created and seed the DB
            ServiceProvider builtServiceProvider = serviceCollection.BuildServiceProvider();
            IServiceScope scopedProvider = builtServiceProvider.CreateScope();

            IServiceProvider scopedServiceProvider = scopedProvider.ServiceProvider;
            ApplicationDbContext dbContext = scopedServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.OpenConnection();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();

            //dbContext.CrewRoles.Add(new CrewUser { Id = 1, Description = "Test Rolle 1" });
            //dbContext.CrewRoles.Add(new CrewUser { Id = 2, Description = "Test Rolle 2" });
            //dbContext.CrewRoles.Add(new CrewUser { Id = 3, Description = "Test Rolle 3" });

            dbContext.SaveChangesAsync();
        }
    }
}
