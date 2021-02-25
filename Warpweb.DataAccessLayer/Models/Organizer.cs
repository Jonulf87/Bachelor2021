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
        public string ContactId { get; set; }

        [ForeignKey(nameof(ContactId))]
        public virtual ApplicationUser Contact { get; set; } //Organizer contact person
        public virtual ICollection<MainEvent> MainEvent { get; set; }

    }
}
