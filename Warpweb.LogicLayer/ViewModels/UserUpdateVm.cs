﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Warpweb.LogicLayer.ViewModels
{
    public class UserUpdateVm
    {

        [Required]
        [MinLength(2, ErrorMessage = "Navn for kort")]
        [MaxLength(50, ErrorMessage = "Navn for langt")]
        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-.]+$", ErrorMessage = "Ugyldig navn")]
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        [Required]
        [MinLength(2, ErrorMessage = "Navn for kort")]
        [MaxLength(50, ErrorMessage = "Navn for langt")]
        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-.]+$", ErrorMessage = "Ugyldig etternavn")]
        public string LastName { get; set; }

        [Required]
        [RegularExpression(@"^((\+|00)47[-]?)?[0-9]{8}$", ErrorMessage = "Ugyldig telefonnummer")]
        public string PhoneNumber { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{4}$", ErrorMessage = "Postnummer må inneholde 4 sifre")]
        public string ZipCode { get; set; }
        [Required]
        public string Gender { get; set; }
        public bool IsAllergic { get; set; }
        public string AllergyDescription { get; set; }
        public string Comments { get; set; }
        public string Team { get; set; }

        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-.]+$", ErrorMessage = "Ugyldig navn")]
        public string ParentFirstName { get; set; }

        [RegularExpression(@"^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-.]+$", ErrorMessage = "Ugyldig etternavn")]
        public string ParentLastName { get; set; }

        [RegularExpression(@"^((\+|00)47[-]?)?[0-9]{8}$", ErrorMessage = "Ugyldig telefonnummer")]
        public string ParentPhoneNumber { get; set; }

        //[EmailAddress(ErrorMessage = "Du må oppgi en gyldig e-post adresse til forelder")] Det må skrives en custom tag som sjekker for korrekt epost bare hvis bruker er under 16 år.
        public string ParentEMail { get; set; }
    }
}
