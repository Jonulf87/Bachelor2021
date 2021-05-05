using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The Crew class. Crews represent ApplicationUsers that are given roles within a MainEvent.
    /// </summary>
    /// <remarks>
    /// Each Crew has one or more leaders and none or more members.
    /// Each Crew has one or more sets of CrewPermissions to define access within the application.
    /// </remarks>
    public class Crew
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<CrewUser> Users { get; set; }
        public ICollection<CrewPermission> CrewPermissions { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }
    }
}
