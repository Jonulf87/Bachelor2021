﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class TicketType
    {
        public int Id { get; set; }
        public string DescriptionName { get; set; } //Kanskje gjøre noe med navnet. Er meningen å være navn på type billett, f.eks. første klasse eller økonomi eller silver.
        public int BasePrice { get; set; }
        public int AmountAvailable { get; set; }
    }
}
