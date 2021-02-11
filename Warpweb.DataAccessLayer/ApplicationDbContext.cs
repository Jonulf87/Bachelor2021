using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.DataAccessLayer
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Organizer> Organizers { get; set; }
        public DbSet<Crew> Crews { get; set; }
        public DbSet<CrewRole> CrewRoles { get; set; }
        public DbSet<MainEvent> MainEvents { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Venue> Venues { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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

            var hashedPassword = new PasswordHasher<ApplicationUser>();
            user.PasswordHash = hashedPassword.HashPassword(user, "SecretPassword");


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
                builder.Entity<IdentityRole>().HasData(
                    new IdentityRole { Name = role}
                );
            }

            builder.Entity<ApplicationUser>().HasData(user);


            var _userManager = new UserManager<ApplicationUser>;
        }


    }
}
