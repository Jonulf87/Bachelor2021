using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Seat
    {
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public bool IsReserved
        {
            get
            {
                return Ticket != null;
            }
        }

        public virtual Ticket Ticket { get; set; }

        [ForeignKey(nameof(Row))]
        public int RowId { get; set; }
        public virtual Row Row { get; set; }
    }
}