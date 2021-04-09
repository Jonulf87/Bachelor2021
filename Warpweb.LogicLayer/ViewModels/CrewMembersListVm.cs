using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class CrewMembersListVm
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string EMail { get; set; }
        public bool IsLeader { get; set; }
        public string Comment { get; set; }
    }
}
