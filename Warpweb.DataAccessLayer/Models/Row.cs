﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class Row
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
        public bool isVertical { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }

        public virtual ICollection<Seat> Seats { get; set; }
    }
}