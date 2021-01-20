using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class TicketType
    {
        public int TicketTypeId { get; set; }
        public string TicketDescriptionName { get; set; } //Kanskje gjøre noe med navnet
        public int TicketBasePrice { get; set; }
        public int TicketAmountAvailable { get; set; }
    }
}
