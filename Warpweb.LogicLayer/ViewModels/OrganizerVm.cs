using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class OrganizerVm
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string OrgNumber { get; set; }
        [Required]
        public string Description { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactMail { get; set; }
    }
}
