using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
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
        public DbSet<Guardian> Guardians { get; set; }
    }
}
