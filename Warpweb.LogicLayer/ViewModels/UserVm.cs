using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class UserVm
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string ZipCode { get; set; }
        [DataType(DataType.EmailAddress)]
        public string EMail { get; set; }
        public string UserName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public bool IsAllergic { get; set; }
        public string AllergyDescription { get; set; }
        public string Comments { get; set; }
        public string Team { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
