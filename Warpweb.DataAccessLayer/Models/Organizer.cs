using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class Organizer
    {
        public int OrganizerId { get; set; }
        public string OrganizerName { get; set; }
        public string OrganizerCode { get; set; }
        public string OrganizerDescription { get; set; } // VAT/MVA code etc.
        public virtual ApplicationUser OrganizerContactPerson { get; set; }
        public virtual MainEvent MainEvent { get; set; }

    }
}
