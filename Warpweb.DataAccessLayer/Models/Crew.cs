using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Crew
    {
        public int Id { get; set; }
        public string Name { get; set; } //Eks. Logistikkcrew, HMScrew
        public ICollection<CrewUser> Users { get; set; }
        public ICollection<CrewPermission> CrewPermissions { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }
    }
}
