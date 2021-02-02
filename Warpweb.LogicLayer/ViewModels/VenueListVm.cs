using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class VenueListVm
    {
        public int VenueId { get; set; }
        public string VenueName { get; set; }
        public string VenueAddress { get; set; }
        public int VenueAreaAvailable { get; set; }
        public int VenueCapacity { get; set; }
        public int ContactId { get; set; }
    }
}
