using System.Collections.Generic;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class CrewVm
    {
        public int CrewId { get; set; }

        public string CrewName { get; set; }

        public ICollection<CrewRole> CrewRoles { get; set; }
    }
}
