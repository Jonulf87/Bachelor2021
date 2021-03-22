using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Seat
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Ticket))]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }

        public virtual ICollection<TicketType> TicketTypes { get; set; }
        public string SeatNumber { get; set; }
    }
}