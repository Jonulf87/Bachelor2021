using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class LoginUserVm
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
