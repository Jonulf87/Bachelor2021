using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class RowVm
    {
        public string RowName { get; set; }
        public string NumberOfSeats { get; set; }
        public int XPos { get; set; }
        public int YPos { get; set; }
        public bool IsVertical { get; set; }
        public List<SeatVm> Seats { get; set; }
        public List<string> Errors { get; set; }
    }
}
