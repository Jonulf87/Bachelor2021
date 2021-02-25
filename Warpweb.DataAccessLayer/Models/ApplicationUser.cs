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
        [Column(TypeName = "Date")]
        [PersonalData]
        public DateTime DateOfBirth { get; set; }
        [PersonalData]
        public bool IsAllergic { get; set; }
        [PersonalData]
        public string AllergyDescription { get; set; }
        [PersonalData]
        public string Comments { get; set; } //print 

        [Display(Name = "Samtykkeperson")]
        public virtual ICollection<ApplicationUser> Guardian { get; set; } // Verge / foresatt 
        public virtual ICollection<ApplicationUser> Minor { get; set; } // Den mindreårige i vergehierarkiet
        public virtual ICollection<CrewRole> CrewRoles { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }



        public int? YearlyFee { get; set; } //Null angir ingen kontingent betalt
    }
}
