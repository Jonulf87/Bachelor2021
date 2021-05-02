using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The Ticket class. Tickets are sold to ApplicationUsers, are locked to MainEvents, TicketTypes and Seats.
    /// </summary>
    public class Ticket
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public bool IsCheckedIn { get; set; }
        public bool IsPaid { get; set; }
        public int AmountPaid { get; set; }


        [ForeignKey(nameof(Type))]
        public int TicketTypeId { get; set; }
        public virtual TicketType Type { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }

        [ForeignKey(nameof(User))]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        [ForeignKey(nameof(Seat))]
        public int? SeatId { get; set; }
        public virtual Seat Seat { get; set; }

        public virtual ICollection<TicketLog> Logs { get; set; }
    }
}
