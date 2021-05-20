using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.ViewModels
{
    public class EMailUpdateVm
    {
        [Required(ErrorMessage = "Du kan ikke angi en tom string som e-post")]
        [EmailAddress(ErrorMessage = "Fyll inn gyldig e-post")]
        public string EMail { get; set; }
    }
}
