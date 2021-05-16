using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The Organizer class. Organizers represent entities that create and manage MainEvents.
    /// </summary>
    /// <remarks>
    /// Organizers have their own Admins that are given administrative rights within that specific organization
    /// </remarks>
    public class Organizer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OrgNumber { get; set; } 
        public string Description { get; set; }

        [ForeignKey(nameof(Contact))]
        public string ContactId { get; set; }
        public virtual ApplicationUser Contact { get; set; }
        public virtual ICollection<Venue> Venues { get; set; }
        public virtual ICollection<ApplicationUser> Admins { get; set; }
        public virtual ICollection<MainEvent> MainEvents { get; set; }
    }
}
