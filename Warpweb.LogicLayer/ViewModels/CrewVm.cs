using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
