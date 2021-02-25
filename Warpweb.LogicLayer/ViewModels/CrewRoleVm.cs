using System.Collections.Generic;
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
