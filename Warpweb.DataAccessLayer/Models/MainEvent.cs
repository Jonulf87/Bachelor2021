using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The MainEvent class. MainEvents represent events taking place within a set date/time span, at a set location and with a given number of tickets available.
    /// </summary>
    /// <remarks>
    /// MainEvents can be create without a Venue, but will need a specified Venue before tickets can be sold.
    /// </remarks>
    public class MainEvent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public int AreaAvailable { get; set; } 
        public int Capacity { get; set; }
        public string InfoComments { get; set; }
        public string OrganizerWebPage { get; set; }

        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        [ForeignKey(nameof(Venue))]
        public int? VenueId { get; set; }
        public virtual Venue Venue { get; set; }

        public virtual ICollection<Row> Rows { get; set; }
        public virtual ICollection<TicketType> TicketTypes { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
        public virtual ICollection<Crew> Crews { get; set; }
    }
}
