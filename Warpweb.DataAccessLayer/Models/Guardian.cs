using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Guardian
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Minor))]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser Minor { get; set; }
    }
}