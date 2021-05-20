using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class TicketLog
    {
        public int Id { get; set; }
        public DateTime TimeLogged { get; set; }
        public string Comment { get; set; }
        public TicketLogType Type { get; set; }

        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        [ForeignKey(nameof(Ticket))]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
    }

    public enum TicketLogType
    {
        Create = 0,
        Pay = 1,
        ChangeSeat = 2,
        CheckIn = 3,
        Refund = 4,
        YearlyFee = 5
    }
}
