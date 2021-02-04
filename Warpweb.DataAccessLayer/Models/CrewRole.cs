using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class CrewRole
    {
        public int CrewRoleId { get; set; }
        public string Description { get; set; } //Hvilken rolle man har i crewet: bemanning eller leder. Eller noe annet. Whatever. Skriv hva du gjør
        public Crew Crew { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

    }
}
