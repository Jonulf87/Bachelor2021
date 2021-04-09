using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class CrewPermission
    {
        public int Id { get; set; }

        [ForeignKey("Crew")]
        public int CrewId { get; set; }
        public virtual Crew Crew { get; set; }
        public CrewPermissionType PermissionType { get; set; }
        //public bool LeaderOnlyPermission { get; set; } //true = kun leder får permission. Sannsynligvis ikke behov. Hvis det skal skilles mellom ledere og medlemmer sine tilganger kan dette implementeres senere.
    }

    public enum CrewPermissionType
    {
        CheckInAdmin = 0,
        CrewAdmin = 1,
        TicketAdmin = 2
    }
}