using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class MainEvent //Arrangementet. Events under arrangementet heter SubEvents
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [DataType(DataType.Time)]
        public DateTime StartTime { get; set; }

        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        [DataType(DataType.Time)]
        public DateTime EndTime { get; set; }

        [ForeignKey(nameof(Organizer))]
        public int OrganizerId { get; set; }
        public virtual Organizer Organizer { get; set; }

        public virtual Venue Venue { get; set; }
    }
}
