using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class SeatGroup // Dette er et bord
    {
        public int Id { get; set; }
        public virtual ICollection<Row> Rows { get; set; }

    }
}