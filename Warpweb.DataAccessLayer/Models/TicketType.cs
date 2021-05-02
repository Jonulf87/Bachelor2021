using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The TicketType class. TicketTypes represent the different ticket groups with specific attributes such as availability and price.
    /// <remarks>
    /// TicketTypes are locked to Rows in the SeatMap.
    /// </remarks>
    public class TicketType
    {
        public int Id { get; set; }
        public string DescriptionName { get; set; }
        public int BasePrice { get; set; }
        public int AmountAvailable { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }

        public virtual ICollection<Row> Rows { get; set; }
    }
}
