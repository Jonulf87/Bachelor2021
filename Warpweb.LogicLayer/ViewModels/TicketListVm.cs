using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class TicketListVm
    {
        public int Price { get; set; }
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public string RowName { get; set; }
        public string TicketType { get; set; }
        public string MainEventName { get; set; }
        public string UserId { get; set; }
    }
}
