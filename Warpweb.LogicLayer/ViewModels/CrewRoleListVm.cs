using System.Collections.Generic;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class CrewRoleListVm
    {
        public int CrewRoleId { get; set; }
        public bool IsLeader { get; set; }
        public int CrewId { get; set; }
    }
}
