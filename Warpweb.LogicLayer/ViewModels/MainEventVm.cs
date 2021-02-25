using System;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int VenueId { get; set; }
        public int OrganizerId { get; set; }
    }
}
