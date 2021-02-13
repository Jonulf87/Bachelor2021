using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class CrewRoleVm
    {
        public int CrewRoleId { get; set; }
        public string Description { get; set; }
        public ICollection<Crew> Crews { get; set; }
    }
}
