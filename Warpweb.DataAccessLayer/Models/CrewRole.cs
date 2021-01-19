using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    class CrewRole
    {
        public int CrewRoleId { get; set; }
        public string Role { get; set; } //Hvilken rolle man har i crewet: bemanning eller leder.
        public Crew Crew { get; set; }
        public virtual User User { get; set; }

    }
}
