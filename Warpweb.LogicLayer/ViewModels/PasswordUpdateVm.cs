using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class PasswordUpdateVm
    {
        [Required(ErrorMessage = "Du må ha med det gamle passordet ditt")]
        [DataType(DataType.Password)]
        [MinLength(12, ErrorMessage = "Passordet må være minst 12 karakterer langt" )]
        public string OldPassword { get; set; }
        [Required(ErrorMessage = "Du må fylle inn et nytt passord")]
        [DataType(DataType.Password)]
        [MinLength(12, ErrorMessage = "Passordet må være minst 12 karakterer langt")]
        public string NewPassword { get; set; }
        [Required(ErrorMessage = "Du må sjekke passordet ditt")]
        [Compare(nameof(NewPassword), ErrorMessage = "Passord er ikke like")]
        public string CheckNewPassword { get; set; }
    }
}
