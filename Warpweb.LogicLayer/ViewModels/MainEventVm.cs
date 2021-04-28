using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventVm
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string VenueName { get; set; }
        public int? VenueId { get; set; }
        [Required]
        public int OrganizerId { get; set; }
        public string OrganizerName { get; set; }
        public string InfoComments { get; set; }
        public string OrganizerWebPage { get; set; }
    }
}
