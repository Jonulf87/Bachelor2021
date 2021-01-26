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
        public string OrganizerCode { get; set; } // VAT/MVA code etc.
        public string OrganizerDescription { get; set; } 
        public virtual ApplicationUser OrganizerContactPerson { get; set; }
        public virtual List<MainEvent> MainEvent { get; set; }

    }
}
