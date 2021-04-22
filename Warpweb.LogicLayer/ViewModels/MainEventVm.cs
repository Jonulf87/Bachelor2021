using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventVm
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime EndTime { get; set; }
        public string VenueName { get; set; }
        public int? VenueId { get; set; }
        [Required]
        public int OrganizerId { get; set; }
        public string OrganizerName { get; set; }
        public string InfoComments { get; set; }
        public string OrganizerWebPage { get; set; }
    }
}
