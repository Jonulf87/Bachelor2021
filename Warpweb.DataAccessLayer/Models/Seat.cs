using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Seat
    {
        public int Id { get; set; }
        public string SeatNumber { get; set; }
        public bool isReserved { get; set; }
        public bool isBought { get; set; }

        [ForeignKey(nameof(Ticket))]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }

        [ForeignKey(nameof(Row))]
        public int RowId { get; set; }
        public virtual Row Row { get; set; }

        public virtual ICollection<TicketType> TicketTypes { get; set; }
    }
}