using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class PublicRowVm
    {
        public int Id { get; set; }
        public string RowName { get; set; }
        public int XPos { get; set; }
        public int YPos { get; set; }
        public bool IsVertical { get; set; }
        public List<PublicSeatVm> Seats { get; set; }
        public List<int> TicketTypeIds { get; set; }
    }
}
