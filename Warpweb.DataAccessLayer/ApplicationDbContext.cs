using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
        public DbSet<CrewUser> CrewRoles { get; set; }
        public DbSet<MainEvent> MainEvents { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<CrewPermission> CrewPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Organizer>()
                .HasMany(a => a.Admins)
                .WithMany(a => a.AdminRoleAtOrganizers)
                .UsingEntity(a => a.ToTable("OrganizerAdmins"));
        }

    }
}
