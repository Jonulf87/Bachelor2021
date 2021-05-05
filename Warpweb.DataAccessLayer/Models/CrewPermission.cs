using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The CrewPermission class. CrewPermissions define access to the different modules within the Application.
    /// </summary>
    /// <remarks>
    /// If rights are removed from the CrewPermissionType Enum, a comment must replace it so the value will not be used.
    /// </remarks>
    public class CrewPermission
    {
        public int Id { get; set; }

        [ForeignKey("Crew")]
        public int CrewId { get; set; }
        public virtual Crew Crew { get; set; }
        public CrewPermissionType PermissionType { get; set; }
        //public bool LeaderOnlyPermission { get; set; } //true = kun leder får permission. Sannsynligvis ikke behov. Hvis det skal skilles mellom ledere og medlemmer sine tilganger kan dette implementeres senere.
    }

    //Ved fjerning av rettiheter fra enum må det legges inn comment om å ikke bruke den verdien
    public enum CrewPermissionType
    {
        CheckInAdmin = 0,
        CrewAdmin = 1,
        TicketAdmin = 2,
        SeatMapAdmin = 3,
        UserAdmin = 4,
        ReportAdmin = 5,
        VenueAdmin = 6,
        ParticipantAdmin = 7
    }

}