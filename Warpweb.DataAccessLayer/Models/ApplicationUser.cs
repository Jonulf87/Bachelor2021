using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Warpweb.DataAccessLayer.Models
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData]
        public string FirstName { get; set; }
        [PersonalData]
        public string MiddleName { get; set; }
        [PersonalData]
        public string LastName { get; set; }
        [PersonalData]
        public string Address { get; set; }
        [PersonalData]
        public string ZipCode { get; set; }
        [PersonalData]
        public string Team { get; set; }
        [Column(TypeName = "Date")]
        [PersonalData]
        public DateTime DateOfBirth { get; set; }
        [PersonalData]
        public bool IsAllergic { get; set; }
        [PersonalData]
        public string AllergyDescription { get; set; }
        [PersonalData]
        public string Gender { get; set; }

        [PersonalData]
        public string Comments { get; set; } //print 

        [Display(Name = "Verge")]
        [PersonalData]
        public virtual Guardian Guardian { get; set; } // Verge / foresatt 

        [PersonalData]
        public virtual ICollection<CrewUser> Crews { get; set; }
        
        [PersonalData]
        public virtual ICollection<Ticket> Tickets { get; set; }
        
        [PersonalData]
        public virtual ICollection<Organizer> AdminRoleAtOrganizers { get; set; } //Organisasjonen brukeren er admin i
        
        [InverseProperty("Contact")]
        public virtual ICollection<Organizer> ContactForOrganizer { get; set; } //Organisasjonen som brukeren er kontaktperson i

        [ForeignKey("CurrentMainEvent")]
        public int? CurrentMainEventId { get; set; }
        public virtual MainEvent CurrentMainEvent { get; set; }

        public int? YearlyFee { get; set; } //Null angir ingen kontingent betalt
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<TicketLog> Logs { get; set; }
    }
}
