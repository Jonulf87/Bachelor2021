using System.Collections.Generic;

namespace Warpweb.DataAccessLayer.Models
{
    public class Row
    {
        public int Id { get; set; }
        public virtual ICollection<Seat> Seats { get; set; }
    }
}