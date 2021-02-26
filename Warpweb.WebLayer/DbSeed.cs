using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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

                //var ticketType = new TicketType
                //{
                //    BasePrice = 350,
                //    DescriptionName = "Platinum"
                //};
                
                

                //var ticket = new Ticket
                //{
                //    Price = 350,
                //    Seat = "14D",
                //    TicketType = new TicketType { DescriptionName = "Platinum", BasePrice = 350 }
                //};



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
                    var result = await userManager.CreateAsync(user, "SuperHemmelig");
                    if (!result.Succeeded) {
                        Console.WriteLine("Failed to create user #1");
                    }
                    
                };

                var user2Exist = await userManager.FindByEmailAsync(user2.Email);
                if (user2Exist == null)
                {
                    var result = await userManager.CreateAsync(user2, "SuperHemmelig");
                    if (!result.Succeeded) {
                        Console.WriteLine("Failed to create user #2");
                    }
                   
                };

                var user3Exist = await userManager.FindByEmailAsync(user3.Email);
                if (user3Exist == null)
                {
                    var result = await userManager.CreateAsync(user3, "IkkeHemmelig");
                    if (!result.Succeeded) {
                        Console.WriteLine("Failed to create user #3");
                    }
                };
                
                //user3Exist.Tickets.Add(ticket); 
                //userManager.save(user3Exist);
            }
        }
    }
}
