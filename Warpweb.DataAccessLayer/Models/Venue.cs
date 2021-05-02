using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The Venue class. Venues represent physical entities where MainEvents take place.
    /// </summary>
    /// <remarks>
    /// Each Organizer has its own list of Venues, thus the same Venue can exist in multiple MainEvents arranged by different Organizers.
    /// </remarks>
    public class Venue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEMail { get; set; }

        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        public virtual ICollection<MainEvent> MainEvents { get; set; }
    }
}
