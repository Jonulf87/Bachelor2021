using System;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class MainEventListVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public Venue Venue { get; set; }
        public Organizer Organizer { get; set; }
    }
}
