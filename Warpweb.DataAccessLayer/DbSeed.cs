using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.DataAccessLayer
{
    class DbSeed
    {
        private readonly ApplicationDbContext _dbContext;

        public DbSeed(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async void SeedRoles()
        {
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
                var roleStore = new RoleStore<IdentityRole>(_dbContext);

                if (!_dbContext.Roles.Any(a => a.Name == role))
                {
                    await roleStore.CreateAsync(new IdentityRole(role));
                }
            };

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

            if (!_dbContext.ApplicationUsers.Any(a => a.UserName == user.UserName))
            {
                var password = new PasswordHasher<ApplicationUser>();
                var hashedPassword = password.HashPassword(user, "SecretPassword");
                user.PasswordHash = hashedPassword;

                var userStore = new UserStore<ApplicationUser>(_dbContext);
                var result = userStore.CreateAsync(user);
            }








        }
    }
}
