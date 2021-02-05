using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Seat
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        [ForeignKey(nameof(TicketId))]
        public virtual Ticket Ticket { get; set; }
        public virtual ICollection<TicketType> TicketTypes { get; set; }
        public string SeatNumber { get; set; }
    }
}