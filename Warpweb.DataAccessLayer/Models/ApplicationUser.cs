using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class ApplicationUser : IdentityUser
    {
        [ProtectedPersonalData]
        public string FirstName { get; set; }
        [ProtectedPersonalData]
        public string? MiddleName { get; set; }
        [ProtectedPersonalData]
        public string LastName { get; set; }
        [ProtectedPersonalData]
        public string EMail { get; set; }
        [ProtectedPersonalData]
        public string Address { get; set; }
        [Column(TypeName = "Date")]
        [ProtectedPersonalData]
        public DateTime DateOfBirth { get; set; }
        [ProtectedPersonalData]
        public bool IsAllergic { get; set; }
        [ProtectedPersonalData]
        public string AllergyDescription { get; set; }
        [ProtectedPersonalData]
        public string Comments { get; set; } //print 

        [Display(Name = "Samtykkeperson")]
        public virtual Guardian Guardian { get; set; } // Verge / foresatt
        public virtual List<CrewRole> CrewRoles { get; set; }
        public virtual List<Ticket> Tickets { get; set; }


        public int? YearlyFee { get; set; } //Null angir ingen kontingent betalt
    }
}
