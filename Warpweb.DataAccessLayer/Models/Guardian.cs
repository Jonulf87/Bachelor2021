using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class Guardian
    {
        public int GuardianId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public bool Verified { get; set; } //Må sjekkes manuelt av signert papir -> BankID?
    }
}
