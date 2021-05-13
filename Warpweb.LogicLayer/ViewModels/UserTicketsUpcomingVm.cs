using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class UserTicketsUpcomingVm
    {
        public int Id { get; set; }
        public  int Price { get; set; }
        public int? SeatNumber { get; set; }
        public int? SeatId { get; set; }
        public string RowName { get; set; }
        public string TicketType { get; set; }
        public int TicketTypeId { get; set; }
        public string MainEventName { get; set; }
        public int MainEventId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string VenueName { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
    }
}
