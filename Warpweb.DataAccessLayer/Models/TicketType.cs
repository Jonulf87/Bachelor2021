using System.ComponentModel.DataAnnotations.Schema;

namespace Warpweb.DataAccessLayer.Models
{
    public class TicketType
    {
        public int Id { get; set; }
        public string DescriptionName { get; set; } //Kanskje gjøre noe med navnet. Er meningen å være navn på type billett, f.eks. første klasse eller økonomi eller silver.
        public int BasePrice { get; set; }
        public int AmountAvailable { get; set; }
        public virtual Ticket Ticket { get; set; }

        [ForeignKey(nameof(MainEvent))]
        public int MainEventId { get; set; }
        public virtual MainEvent MainEvent { get; set; }
    }
}
