using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class PublicSeatVm
    {
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public bool IsReserved { get; set; }
    }
}
