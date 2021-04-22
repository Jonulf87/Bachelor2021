using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class GendersReportVm
    {
        public int MaleAmount { get; set; }
        public int FemaleAmount { get; set; }
        public int OtherAmount { get; set; }
        public int NotDisclosedAmount { get; set; }
    }
}
