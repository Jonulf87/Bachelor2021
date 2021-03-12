using System.Collections.Generic;

namespace Warpweb.DataAccessLayer.Models
{
    public class Crew
    {
        public int Id { get; set; }
        public string Name { get; set; } //Eks. Logistikkcrew, HMScrew
        public ICollection<CrewUser> Users { get; set; }
        public ICollection<CrewPermission> CrewPermissions { get; set; }
    }
}
