using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Minor
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Guardian))]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser Guardian { get; set; }
    }
}