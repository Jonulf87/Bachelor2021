using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class MainEvent //Arrangementet. Events under arrangementet heter SubEvents
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int VenueId { get; set; }
        [ForeignKey(nameof(VenueId))]
        public virtual Venue Venue { get; set; }
        public int OrganizerId { get; set; }
        [ForeignKey(nameof(OrganizerId))]
        public virtual Organizer Organizer { get; set; }
    }
}
