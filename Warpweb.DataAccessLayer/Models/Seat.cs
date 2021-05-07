using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The Seat class. Seats are locked to Rows
    /// </summary>
    public class Seat
    {
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public bool IsReserved { get; set; }

        public virtual Ticket Ticket { get; set; }

        [ForeignKey(nameof(Row))]
        public int RowId { get; set; }
        public virtual Row Row { get; set; }
    }
}