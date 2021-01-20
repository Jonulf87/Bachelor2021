using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class Crew
    {
        public int CrewId { get; set; }
        public string CrewName { get; set; } //Eks. Logistikkcrew, HMScrew
        public List<CrewRole> CrewRoles { get; set; }
        //public virtual List<User> Users { get; set; } Crew peker mot crewrolle i stedet.
    }
}
