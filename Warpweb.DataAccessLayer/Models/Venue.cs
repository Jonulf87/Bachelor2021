using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Venue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int AreaAvailable { get; set; } //Ikke behov, fjern etterhvert i samarbeid med Frontend.
        public int Capacity { get; set; } //Skal etterhvert overtas av SeatGroups 

        [Display(Name ="Kontaktperson lokasjon")]
        public virtual ICollection<ApplicationUser> Users { get; set; } //Dette er kontaktpersonen(e) til lokalet hvor arrangementet pågår
        public virtual ICollection<SeatGroup> SeatGroups { get; set; } //Bord som er i venue
        public virtual ICollection<MainEvent> MainEvents { get; set; }
    }
}
