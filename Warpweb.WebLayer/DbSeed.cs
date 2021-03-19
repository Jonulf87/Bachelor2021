using System;
using System.Collections;
using System.Collections.Generic;
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
            var roleSuperAdminExist = await roleManager.RoleExistsAsync("SuperAdmin");
            var roleAdminExist = await roleManager.RoleExistsAsync("Admin");
            var roleUserExist = await roleManager.RoleExistsAsync("User");

            // Lag rolle hvis ikke eksisterer
            if (!roleSuperAdminExist)
            {
                var role = new IdentityRole();
                role.Name = "Superadmin";
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

            //Opprett noen brukere

            var userPostman = new ApplicationUser
            {
                FirstName = "Post",
                MiddleName = "Hey Mr.",
                LastName = "Man",
                Email = "postmanwarpweb@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+111111111111",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "postmanwarpweb@gmail.com",
                Address = "Oslogaten 13",
                IsAllergic = true,
                AllergyDescription = "Tåler ikke nøtter og skalldyr.",
                Comments = "Må reise seg hvert femte minutt, hvis ikke stivner kneet i beinprotesen."
            };

            var userJanHansen = new ApplicationUser
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
                Address = "Hjemme",
                IsAllergic = false,
                Comments = "Jeg liker skilpadder."
            };

            var userOleBrumm = new ApplicationUser
            {
                FirstName = "Ole",
                LastName = "Brum",
                Email = "olebole247@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+111111111111",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "olebole247@gmail.com",
                IsAllergic = false,
                Comments = "You never saw me here."
            };

            var userKristian = new ApplicationUser
            {
                FirstName = "Kristian",
                MiddleName = "oooohhh... look at me",
                LastName = "Pettersen",
                Email = "pettersen@mail.com",
                EmailConfirmed = true,
                PhoneNumber = "+45983245",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "pettersen@mail.com",
                Address = "Fjaseveien 51",
                IsAllergic = true,
                AllergyDescription = "Tåler ikke Ole Brumm.",
                Comments = "Hater Ole Brumm"
            };

            var userChristian = new ApplicationUser
            {
                FirstName = "Kristian",
                MiddleName = "Christian",
                LastName = "Kristiansen",
                Email = "Kristiansen@gmail.com",
                EmailConfirmed = true,
                PhoneNumber = "+6578451298",
                PhoneNumberConfirmed = true,
                LockoutEnabled = false,
                UserName = "kristiansen@gmail.com",
                Address = "I kjelleren til mamma og pappa",
                IsAllergic = true,
                AllergyDescription = "Allergisk mot idioti.",
                Comments = "Får kraftig utslett i nærheten av idioter."
            };

            List<ApplicationUser> users = new List<ApplicationUser>();

            users.Add(userPostman);
            users.Add(userKristian);
            users.Add(userChristian);
            users.Add(userOleBrumm);
            users.Add(userJanHansen);

            foreach (ApplicationUser user in users)
            {
                if(await userManager.FindByEmailAsync(user.Email) == null)
                {
                    if(user.Email == "postmanwarpweb@gmail.com")
                    {
                        await userManager.CreateAsync(user, "SuperHemmelig");
                        await userManager.AddToRoleAsync(user, "Superadmin");
                        await userManager.AddToRoleAsync(user, "Admin");
                        await userManager.AddToRoleAsync(user, "User");
                    }
                    else
                    {
                        await userManager.CreateAsync(user, "SuperHemmelig");
                        await userManager.AddToRoleAsync(user, "Admin");
                        await userManager.AddToRoleAsync(user, "User");
                    }
                }
            }

            //Liste over admins til Waprcrew
            List<ApplicationUser> adminsListWarpcrew = new List<ApplicationUser>();
            adminsListWarpcrew.Add(userPostman);
            adminsListWarpcrew.Add(userJanHansen);

            //Liste over admins til Kandu
            List<ApplicationUser> adminsListKandu = new List<ApplicationUser>();
            adminsListKandu.Add(userChristian);
            adminsListKandu.Add(userKristian);

            //Liste over admins til Hordalan
            List<ApplicationUser> adminsListHordalan = new List<ApplicationUser>();
            adminsListHordalan.Add(userOleBrumm);

            // Opprett noen arrangører
            var organizerWarpcrew = new Organizer
            {
                Name = "Warpcrew",
                OrgNumber = "123456789",
                Description = "Warpcrew er en ting.",
                Admins = adminsListWarpcrew
            };

            var organizerKandu = new Organizer
            {
                Name = "Kandu",
                OrgNumber = "34567891011",
                Description = "Bedre enn WarpCrew.",
                Admins = adminsListKandu
            };

            var organizerHordalan = new Organizer
            {
                Name = "Hordalan",
                OrgNumber = "324098712304987",
                Description = "Uti skjærgården et sted.",
                Admins = adminsListHordalan
            };

            dbContext.Organizers.Add(organizerWarpcrew);
            dbContext.Organizers.Add(organizerKandu);
            dbContext.Organizers.Add(organizerHordalan);
            dbContext.SaveChanges();


            // Legg til noen lokaler
            var venueRockefeller = new Venue
            {
                Name = "Rockefeller",
                Address = "Torggata Bad 1",
                AreaAvailable = 56,
                Capacity = 3,
                Users = adminsListWarpcrew
            };

            var venueSpektrum = new Venue
            {
                Name = "Spektrum",
                Address = "Ikke Torggata Bad 1",
                AreaAvailable = 1000,
                Capacity = 1000,
                Users = adminsListKandu
            };

            var venueVikingskipet = new Venue
            {
                Name = "Vikingskipet",
                Address = "Hamargaten 1",
                AreaAvailable = 1500,
                Capacity = 4000,
                Users = adminsListHordalan
            };

            dbContext.Venues.Add(venueRockefeller);
            dbContext.Venues.Add(venueSpektrum);
            dbContext.Venues.Add(venueVikingskipet);
            dbContext.SaveChanges();

            // Legg til noen events
            var mainEventWarpzone = new MainEvent
            {
                Name = "WarpZone 21",
                OrganizerId = organizerWarpcrew.Id,
                Venue = venueRockefeller
            };

            var mainEventTheGathering = new MainEvent
            {
                Name = "TG 21",
                OrganizerId = organizerKandu.Id,
                Venue = venueSpektrum
            };

            var mainEventHordalan = new MainEvent
            {
                Name = "Hordalan 21",
                OrganizerId = organizerHordalan.Id,
                Venue = venueVikingskipet
            };


            dbContext.MainEvents.Add(mainEventWarpzone);
            dbContext.MainEvents.Add(mainEventTheGathering);
            dbContext.MainEvents.Add(mainEventHordalan);
            dbContext.SaveChanges();
  
        }
    }
}
