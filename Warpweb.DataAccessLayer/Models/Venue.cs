using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Venue
    {
        public int VenueId { get; set; }
        public string VenueName { get; set; }
        public string VenueAddress { get; set; }
        public int VenueAreaAvailable { get; set; }
        public int VenueCapacity { get; set; }

        [Display(Name ="Kontaktperson lokasjon")]
        public virtual ICollection<ApplicationUser> Users { get; set; } //Dette er kontaktpersonen(e) til lokalet hvor arrangementet pågår
        public virtual ICollection<SeatGroup> SeatGroups { get; set; } //Bord som er i venue
        
        [ForeignKey("MainEvent")]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }
    }
}
