using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Guardian
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string EMail { get; set; }

        [ForeignKey(nameof(Minor))]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser Minor { get; set; }
    }
}