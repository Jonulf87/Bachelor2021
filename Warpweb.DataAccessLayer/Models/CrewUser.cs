using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The CrewUser class. CrewUsers are ApplicationUsers that are given Crew roles within a MainEvent.
    /// </summary>
    /// <remarks>
    /// The Comment field allows for noting special attributes of the CrewUser such as licenses etc.
    /// </remarks>
    public class CrewUser
    {
        public int Id { get; set; }
        public bool IsLeader { get; set; }
        public string Comment { get; set; }

        [ForeignKey("Crew")]
        public int CrewId { get; set; }
        public virtual Crew Crew { get; set; }

        [ForeignKey("ApplicationUser")]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
