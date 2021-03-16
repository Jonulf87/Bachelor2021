using System;
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

            //Lager noen brukere
            var user = new ApplicationUser
            {
                FirstName = "Post",
                LastName = "Man",
                Email = "postmanwarpweb@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+111111111111",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "postmanwarpweb@gmail.com"
            };

            var user2 = new ApplicationUser
            {
                FirstName = "Jan",
                MiddleName = "Petter",
                LastName = "Hansen",
                Email = "Hansen69@mail.com",
                EmailConfirmed = true,
                PhoneNumber = "45454545",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "Hansen69@mail.com",
                Address = "Hjemme"

            };

            var user3 = new ApplicationUser
            {
                FirstName = "Ole",
                LastName = "Brum",
                Email = "olebole247@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+111111111111",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "olebole247@gmail.com"
            };

            // Sjekk om rolle eksisterer
            var roleSuperAdminExist = await roleManager.RoleExistsAsync("SuperAdmin");
            var roleAdminExist = await roleManager.RoleExistsAsync("Admin");
            var roleUserExist = await roleManager.RoleExistsAsync("User");

            // Lag rolle hvis ikke eksisterer
            if (!roleSuperAdminExist)
            {
                var role = new IdentityRole();
                role.Name = "SuperAdmin";
                await roleManager.CreateAsync(role);
            }

            if (!roleAdminExist)
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                await roleManager.CreateAsync(role);
            }

            if (!roleUserExist)
            {
                var role = new IdentityRole();
                role.Name = "User";
                await roleManager.CreateAsync(role);
            }

            // Sett e-post/passord og rolle

            var userExist = await userManager.FindByEmailAsync(user.Email);

            if (userExist == null)
            {
                var result = await userManager.CreateAsync(user, "SuperHemmelig");
                if (!result.Succeeded)
                {
                    Console.WriteLine("Failed to create user #1");
                }

                var roleResult = await userManager.AddToRoleAsync(user, "SuperAdmin");

                if (!roleResult.Succeeded)
                {
                    Console.WriteLine("Failed to add user #1 to role");
                }

            };     

            var user2Exist = await userManager.FindByEmailAsync(user2.Email);

            if (user2Exist == null)
            {
                var result = await userManager.CreateAsync(user2, "SuperHemmelig");
                if (!result.Succeeded)
                {
                    Console.WriteLine("Failed to create user #2");
                }

                var roleResult = await userManager.AddToRoleAsync(user2, "Admin");
                if (!roleResult.Succeeded)
                {
                    Console.WriteLine("Failed to add user #1 to role");
                }

            };

            var user3Exist = await userManager.FindByEmailAsync(user3.Email);

            if (user3Exist == null)
            {
                var result = await userManager.CreateAsync(user3, "IkkeHemmelig");
                if (!result.Succeeded)
                {
                    Console.WriteLine("Failed to create user #3");
                }

                var roleResult = await userManager.AddToRoleAsync(user3, "User");
                if (!roleResult.Succeeded)
                {
                    Console.WriteLine("Failed to add user #1 to role");
                }
            };

            // Ekstra roller for user
            await userManager.AddToRoleAsync(user, "Admin");
            await userManager.AddToRoleAsync(user, "User");

            // Ekstra rolle for user2
            await userManager.AddToRoleAsync(user2, "SuperAdmin");

            // Opprett noen arrangører
            var organizer = new Organizer
            {
                Name = "Warpcrew",
                OrgNumber = "123456789",
                Description = "Warpcrew er en ting."
            };

            var organizer2 = new Organizer
            {
                Name = "CarpWred",
                OrgNumber = "34567891011",
                Description = "Bedre enn WarpCrew"
            };

            dbContext.Organizers.Add(organizer);
            dbContext.Organizers.Add(organizer2);
            dbContext.SaveChanges(); //Savechanges skriver automatisk Id tilbake til eksisterende objekt.

            var mainEvent = new MainEvent
            {
                Name = "WarpZone 21",
                OrganizerId = organizer.Id
            };

            dbContext.MainEvents.Add(mainEvent);
            dbContext.SaveChanges();

            var venue = new Venue
            {
                Name = "Rockefeller",
                Address = "Torggata Bad 1"
            };

            var venue2 = new Venue
            {
                Name = "Spektrum",
                Address = "Ikke Torggata Bad 1"
            };

            dbContext.Venues.Add(venue);
            dbContext.Venues.Add(venue2);
            dbContext.SaveChanges();
        }
    }
}
