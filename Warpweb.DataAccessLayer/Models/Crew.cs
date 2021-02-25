﻿using System.Collections.Generic;

namespace Warpweb.DataAccessLayer.Models
{
    public class Crew
    {
        public int CrewId { get; set; }
        public string CrewName { get; set; } //Eks. Logistikkcrew, HMScrew
        public ICollection<CrewRole> CrewRoles { get; set; }
        //public virtual List<User> Users { get; set; } Crew peker mot crewrolle i stedet.
    }
}
