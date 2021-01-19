using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    class Guardian
    {
        public int GuardianId { get; set; }
        public virtual User User { get; set; }
        public bool Verified { get; set; } //Må sjekkes manuelt av signert papir -> BankID?
    }
}
