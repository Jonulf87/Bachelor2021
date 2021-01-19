using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    class Ticket
    {
        public int TicketId { get; set; }
        public int TicketPrice { get; set; }
       
        
        
        public int Seat { get; set; } //Seteplassering. Må opprette klasse for bordkart
       
        public virtual TicketType TicketType { get; set; }
        public virtual MainEvent MainEvent { get; set; }
        public virtual User User { get; set; }
    }

 
}
