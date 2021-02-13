using System.Collections.Generic;

namespace Warpweb.DataAccessLayer.Models
{
    public class Row
    {
        public int Id { get; set; }
        public virtual ICollection<Seat> Seats { get; set; }
        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
        public string Rotation { get; set; }
    }
}