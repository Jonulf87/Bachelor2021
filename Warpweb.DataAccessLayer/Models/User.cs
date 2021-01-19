using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string EMail { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        [Column(TypeName = "Date")]
        public DateTime DateOfBirth { get; set; }
        public bool IsAllergic { get; set; }
        public string AllergyDescription { get; set; }
        public string Comments { get; set; } //print 

        [Display(Name = "Samtykkeperson")]
        public virtual Guardian Guardian { get; set; } // Verge / foresatt
        public virtual List<CrewRole> CrewRoles { get; set; }
        public virtual List<Ticket> Tickets { get; set; }


        public int? YearlyFee { get; set; } //Null angir ingen kontingent betalt
    }

}
