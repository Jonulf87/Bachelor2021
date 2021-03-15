using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Organizer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OrgNumber { get; set; } // VAT/MVA code etc. Org.nr.
        public string Description { get; set; }

        [ForeignKey(nameof(Contact))]
        public string ContactId { get; set; }
        public virtual ApplicationUser Contact { get; set; } //Organizer contact person

        public virtual ICollection<ApplicationUser> Admins { get; set; }
        public virtual ICollection<MainEvent> MainEvent { get; set; }
    }
}
