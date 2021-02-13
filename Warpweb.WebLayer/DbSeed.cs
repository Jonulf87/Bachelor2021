using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.WebLayer
{
    public class DbSeed : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        
        public DbSeed(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stopToken)
        {
            await SeedRoles();
        }

        private async Task SeedRoles()
        {
            //Lager et nytt DI scope for å hente ut scoped services til å bruke i singleton
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

                var user = new ApplicationUser
                {
                    FirstName = "Post",
                    LastName = "Man",
                    Email = "postmanwarpweb@gmail.com",
                    EmailConfirmed = true,
                    Id = "1",
                    PhoneNumber = "+111111111111",
                    PhoneNumberConfirmed = true,
                    LockoutEnabled = false,
                    UserName = "PostMan"
                };

                string[] roles = new string[]
                {
                    "Tenant",
                    "Superadmin",
                    "Admin",
                    "Crewleader",
                    "Crewmember",
                    "user"
                };

                foreach (string role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole { Name = role });
                    }
                }

                var userExist = await userManager.FindByEmailAsync(user.Email);

                if (userExist == null)
                {
                    await userManager.CreateAsync(user, "SuperHemmelig");
                };
            }
        }
    }
}
