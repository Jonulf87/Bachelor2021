using System;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventListVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime EndTime { get; set; }
        public string VenueName { get; set; }
        public string OrganizerName { get; set; }
        public string InfoComments { get; set; }
        public string OrganizerWebPage { get; set; }
    }
}
