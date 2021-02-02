using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public int Price { get; set; }
       
        
        
        public string Seat { get; set; } //Seteplassering. Må opprette klasse for bordkart
       
        public virtual TicketType TicketType { get; set; }
        public virtual MainEvent MainEvent { get; set; }
        public virtual ApplicationUser User { get; set; }
    }

 
}
