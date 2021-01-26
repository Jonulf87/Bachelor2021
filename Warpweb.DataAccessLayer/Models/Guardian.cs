using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class Guardian
    {
        public int GuardianId { get; set; }
        [ForeignKey("ApplicationUser")]
        public virtual ApplicationUser ApplicationUser { get; set; }
        public bool Verified { get; set; } //Må sjekkes manuelt av signert papir -> BankID?
    }
}
