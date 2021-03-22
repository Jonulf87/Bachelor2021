﻿using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class TicketVm
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public Seat Seat { get; set; }
        public TicketType Type { get; set; }
        public MainEvent MainEvent { get; set; }
        public ApplicationUser User { get; set; }
    }
}
