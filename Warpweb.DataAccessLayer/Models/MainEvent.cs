using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class MainEvent //Arrangementet. Events under arrangementet heter SubEvents
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }

        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        [ForeignKey(nameof(Venue))]
        public int VenueId { get; set; }
        public virtual Venue Venue { get; set; }
    }
}
