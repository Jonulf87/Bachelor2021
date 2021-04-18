using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Venue
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string PostalCode { get; set; }
        [Required]
        public string ContactName { get; set; }
        [Required]
        [Phone]
        public string ContactPhone { get; set; }
        [Required]
        [EmailAddress]
        public string ContactEMail { get; set; }

        [Required]
        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        public virtual ICollection<MainEvent> MainEvents { get; set; }
    }
}
