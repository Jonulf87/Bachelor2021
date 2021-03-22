using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class TicketListVm
    {
        public int Price { get; set; }
        public int Id { get; set; }
        public Seat Seat { get; set; }
        public TicketType Type { get; set; }
        public MainEvent MainEvent { get; set; }
        public ApplicationUser User { get; set; }
    }
}
