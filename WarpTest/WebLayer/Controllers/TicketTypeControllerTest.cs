using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class TicketTypeControllerTest : BaseTest
    {
        private const string _descrName1 = "Description name 1";
        private const int _basePrice1 = 10;
        private const int _amountAvailable1 = 50;
        private const string _descrName2 = "Description name 2";
        private const int _basePrice2 = 20;
        private const int _amountAvailable2 = 150;


        [Test]
        public async Task ShouldGetTicketTypes()
        {
            CreateTicketTypes();

            TicketTypeService ticketTypeService = new TicketTypeService(_dbContext);
            TicketTypeController ticketTypeController = new TicketTypeController(ticketTypeService);

            List<TicketTypeListVm> result = await ticketTypeController.GetTicketTypes();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(_descrName1, result[0].DescriptionName);
            Assert.AreEqual(_basePrice1, result[0].BasePrice);
            Assert.AreEqual(_amountAvailable1, result[0].AmountAvailable);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_descrName2, result[1].DescriptionName);
            Assert.AreEqual(_basePrice2, result[1].BasePrice);
            Assert.AreEqual(_amountAvailable2, result[1].AmountAvailable);
        }

        [Test]
        public async Task ShouldGetTicketTypeById()
        {
            CreateTicketTypes();

            TicketTypeService ticketTypeService = new TicketTypeService(_dbContext);
            TicketTypeController ticketTypeController = new TicketTypeController(ticketTypeService);

            ActionResult<TicketTypeVm> result1 = await ticketTypeController.GetTicketType(1);

            TicketTypeVm returnedTicketType1 = result1.Value;
            Assert.AreEqual(1, returnedTicketType1.Id);
            Assert.AreEqual(_descrName1, returnedTicketType1.DescriptionName);
            Assert.AreEqual(_basePrice1, returnedTicketType1.BasePrice);
            Assert.AreEqual(_amountAvailable1, returnedTicketType1.AmountAvailable);

            ActionResult<TicketTypeVm> result2 = await ticketTypeController.GetTicketType(2);
            TicketTypeVm returnedTicket2 = result2.Value;
            Assert.AreEqual(2, returnedTicket2.Id);
            Assert.AreEqual(_descrName2, returnedTicket2.DescriptionName);
            Assert.AreEqual(_basePrice2, returnedTicket2.BasePrice);
            Assert.AreEqual(_amountAvailable2, returnedTicket2.AmountAvailable);
        }

        [Test]
        public async Task ShouldCreateTicketType()
        {
            CreateTicketTypes();

            string descrName3 = "Description name 3";
            int basePrice3 = 30;
            int amountAvailable3 = 250;

            TicketTypeService ticketTypeService = new TicketTypeService(_dbContext);
            TicketTypeController ticketTypeController = new TicketTypeController(ticketTypeService);

            TicketTypeVm ticketTypeVm = new TicketTypeVm { DescriptionName = descrName3, BasePrice = basePrice3, AmountAvailable = amountAvailable3 };

            ActionResult<TicketTypeVm> result = await ticketTypeController.CreateTicketType(ticketTypeVm);

            TicketTypeVm createdTicketType = (TicketTypeVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(3, createdTicketType.Id);
            Assert.AreEqual(descrName3, createdTicketType.DescriptionName);
            Assert.AreEqual(basePrice3, createdTicketType.BasePrice);
            Assert.AreEqual(amountAvailable3, createdTicketType.AmountAvailable);

            // Check what we really have in the DB
            TicketType ticketType1 = _dbContext.TicketTypes.Find(3);
            Assert.AreEqual(3, ticketType1.Id);
            Assert.AreEqual(descrName3, ticketType1.DescriptionName);
            Assert.AreEqual(basePrice3, ticketType1.BasePrice);
            Assert.AreEqual(amountAvailable3, ticketType1.AmountAvailable);
        }

        [Test]
        public async Task ShouldUpdateTicketType()
        {
            CreateTicketTypes();

            string newdescrName = "New descr name";
            int newBasePrice = 80;
            int newAmmount = 350;

            TicketTypeService ticketTypeService = new TicketTypeService(_dbContext);
            TicketTypeController ticketTypeController = new TicketTypeController(ticketTypeService);

            TicketTypeVm ticketTypeVm = new TicketTypeVm { Id = 1, DescriptionName = newdescrName, BasePrice = newBasePrice, AmountAvailable = newAmmount };

            await ticketTypeController.UpdateTicketType(ticketTypeVm);

            // Check that only one has been changed
            TicketType ticketType1 = _dbContext.TicketTypes.Find(1);
            Assert.AreEqual(newdescrName, ticketType1.DescriptionName);
            Assert.AreEqual(newBasePrice, ticketType1.BasePrice);
            Assert.AreEqual(newAmmount, ticketType1.AmountAvailable);

            TicketType ticketType2 = _dbContext.TicketTypes.Find(2);
            Assert.AreEqual(_descrName2, ticketType2.DescriptionName);
            Assert.AreEqual(_basePrice2, ticketType2.BasePrice);
            Assert.AreEqual(_amountAvailable2, ticketType2.AmountAvailable);
        }

        [Test]
        public async Task ShouldDeleteTicketType()
        {
            CreateTicketTypes();

            TicketTypeService ticketTypeService = new TicketTypeService(_dbContext);
            TicketTypeController ticketTypeController = new TicketTypeController(ticketTypeService);

            TicketTypeVm ticketTypeVm = new TicketTypeVm { Id = 1 };

            ActionResult<TicketTypeVm> result = await ticketTypeController.DeleteTicketType(ticketTypeVm);
            TicketTypeVm deletedTicketType = (TicketTypeVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedTicketType.Id);

            // Check that we have deleted only the first, but not the other
            TicketType ticketType1 = _dbContext.TicketTypes.Find(1);
            Assert.IsNull(ticketType1);
            TicketType ticketType2 = _dbContext.TicketTypes.Find(2);
            Assert.IsNotNull(ticketType2);
        }

        // Helper methods
        private void CreateTicketTypes()
        {
            _dbContext.TicketTypes.Add(new TicketType { DescriptionName = _descrName1, BasePrice = _basePrice1, AmountAvailable = _amountAvailable1 });
            _dbContext.SaveChanges();
            _dbContext.TicketTypes.Add(new TicketType { DescriptionName = _descrName2, BasePrice = _basePrice2, AmountAvailable = _amountAvailable2 });
            _dbContext.SaveChanges();
        }
    }
}
