using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class TicketListVm
    {
        public int Price { get; set; }
        public int Id { get; set; }
        public string Seat { get; set; }
        public TicketType Type { get; set; }
        public MainEvent MainEvent { get; set; }
        public ApplicationUser User { get; set; }
    }
}
