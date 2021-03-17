using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventVm
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

        public int VenueId { get; set; }
        public int OrganizerId { get; set; }
    }
}
