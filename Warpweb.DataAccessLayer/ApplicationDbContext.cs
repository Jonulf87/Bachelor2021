using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.DataAccessLayer
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        private readonly IMainEventProvider _mainEventProvider;

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions,
            IMainEventProvider mainEventProvider) : base(options, operationalStoreOptions)
        {
            _mainEventProvider = mainEventProvider;
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Organizer> Organizers { get; set; }
        public DbSet<Crew> Crews { get; set; }
        public DbSet<CrewUser> CrewUsers { get; set; }
        public DbSet<MainEvent> MainEvents { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<CrewPermission> CrewPermissions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Guardian> Guardians { get; set; }
        public DbSet<Row> Rows { get; set; }
        public DbSet<Seat> Seats { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Organizer>()
                .HasMany(a => a.Admins)
                .WithMany(a => a.AdminRoleAtOrganizers)
                .UsingEntity(a => a.ToTable("OrganizerAdmins"));

            builder.Entity<Row>()
                .HasMany(a => a.TicketTypes)
                .WithMany(a => a.Rows)
                .UsingEntity(a => a.ToTable("TicketTypeRows"));


            builder.Entity<MainEvent>()
                .HasMany(a => a.Tickets)
                .WithOne(a => a.MainEvent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Venue>()
                .HasMany(a => a.MainEvents)
                .WithOne(a => a.Venue)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<TicketType>()
                .HasQueryFilter(a => a.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<Ticket>()
                .HasQueryFilter(a => a.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<TicketLog>()
                .HasQueryFilter(a => a.Ticket.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<Crew>()
                .HasQueryFilter(a => a.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<CrewPermission>()
                .HasQueryFilter(a => a.Crew.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<CrewUser>()
                .HasQueryFilter(a => a.Crew.MainEventId == _mainEventProvider.MainEventId);

            builder.Entity<Row>()
                .HasQueryFilter(a => a.MainEventId == _mainEventProvider.MainEventId);
            
            builder.Entity<Seat>()
                .HasQueryFilter(a => a.Row.MainEventId == _mainEventProvider.MainEventId);
        }
    }
}
