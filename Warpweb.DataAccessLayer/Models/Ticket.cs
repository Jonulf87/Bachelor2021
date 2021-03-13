﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public string Seat { get; set; } //Seteplassering. Må opprette klasse for bordkart

        [ForeignKey(nameof(Type))]
        public int TicketTypeId { get; set; }
        public virtual TicketType Type { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }

        [ForeignKey(nameof(User))]
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
