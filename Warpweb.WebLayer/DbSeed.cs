using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.WebLayer
{
    public class DbSeed : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        
        public DbSeed(IServiceScopeFactory serviceScopeFactory) //Iservicescopefactory håndterer DI'er, basically
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
            using var scope = _serviceScopeFactory.CreateScope(); //Nytt scope på samme måte som en request mot api.
            var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
            var dbContext = scope.ServiceProvider.GetService<ApplicationDbContext>();

            //Opprette noen roller
            // Sjekk om rolle eksisterer

            var roleAdminExist = await roleManager.RoleExistsAsync("Admin");


            // Lag rolle hvis ikke eksisterer


            if (!roleAdminExist)
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                await roleManager.CreateAsync(role);
            }

            //Opprett noen brukere
            var userPostman = new ApplicationUser
            {
                FirstName = "Post",
                MiddleName = "Hey Mr.",
                LastName = "Man",
                Email = "postmanwarpweb@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+4765875421",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "postmanwarpweb@gmail.com",
                Address = "Oslogaten 13",
                IsAllergic = true,
                AllergyDescription = "Tåler ikke nøtter og skalldyr.",
                Comments = "Må reise seg hvert femte minutt, hvis ikke stivner kneet i beinprotesen.",
                ZipCode = "4017"
            };

            List<ApplicationUser> users = new List<ApplicationUser>();

            users.Add(userPostman);

            foreach (ApplicationUser user in users)
            {
                if(await userManager.FindByEmailAsync(user.Email) == null)
                {
                    if(user.Email == "postmanwarpweb@gmail.com")
                    {
                        await userManager.CreateAsync(user, "SuperHemmelig");
                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                }
            }
        }
    }
}
