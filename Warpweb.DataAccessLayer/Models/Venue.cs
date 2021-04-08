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
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEMail { get; set; }

        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        public virtual ICollection<MainEvent> MainEvents { get; set; }
    }
}
