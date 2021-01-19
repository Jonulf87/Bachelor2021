using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    class Venue
    {
        public int VenueId { get; set; }
        public string VenueAddress { get; set; }
        public int? VenueAreaAvailable { get; set; }
        public int VenueCapacity { get; set; }
        [Display(Name ="Kontaktperson lokasjon")]
        public virtual List<User> Users { get; set; } //Dette er kontaktpersonen(e) til lokalet hvor arrangementet pågår

    }
}
