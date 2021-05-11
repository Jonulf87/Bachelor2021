﻿using System;
using System.Collections.Generic;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.LogicLayer.ViewModels
{
    public class ParticipantListVm
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string EMail { get; set; }
        public string UserName { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
