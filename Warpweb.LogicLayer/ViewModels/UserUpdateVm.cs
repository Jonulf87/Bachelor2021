﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class UserUpdateVm
    {
        public string Id { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$", ErrorMessage = "Ugyldig navn")]
        public string FirstName { get; set; }

        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$", ErrorMessage = "Ugyldig mellomnavn")]
        public string MiddleName { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$", ErrorMessage = "Ugyldig etternavn")]
        public string LastName { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{8}$", ErrorMessage = "Ugyldig telefonnummer")]
        public string PhoneNumber { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{4}$", ErrorMessage = "Postnummer må inneholde 4 sifre")]
        public string ZipCode { get; set; }

        [Required]
        public string UserName { get; set; }

        public bool IsAllergic { get; set; }
        public string AllergyDescription { get; set; }
        public string Comments { get; set; }
        public string Team { get; set; }

        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$", ErrorMessage = "Ugyldig navn")]
        public string ParentFirstName { get; set; }

        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$", ErrorMessage = "Ugyldig etternavn")]
        public string ParentLastName { get; set; }

        [RegularExpression(@"^[0-9]{8}$", ErrorMessage = "Ugyldig telefonnummer")]
        public string ParentPhoneNumber { get; set; }

        [DataType(DataType.EmailAddress)]
        public string ParentEMail { get; set; }
    }
}
