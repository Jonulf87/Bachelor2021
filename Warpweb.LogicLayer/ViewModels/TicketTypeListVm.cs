using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class TicketTypeListVm
    {
        public int Id { get; set; }
        public string DescriptionName { get; set; }
        public int BasePrice { get; set; }
        public int AmountAvailable { get; set; }

    }
}
