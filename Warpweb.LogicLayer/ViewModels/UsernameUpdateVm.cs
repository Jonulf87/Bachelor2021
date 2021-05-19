using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class UsernameUpdateVm
    {
        [Required(ErrorMessage = "Du kan ikke angi en tom streng som brukernavn")]
        public string Username { get; set; }
    }
}
