using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class TicketControllerTest : BaseTest
    {
        private const int _price1 = 10;
        private const string _seat1 = "Seat 1";
        private const int _price2 = 20;
        private const string _seat2 = "Seat 2";

        [Test]
        public async Task ShouldGetTickets()
        {
            
            CreateTickets();

            TicketService ticketService = new TicketService(_dbContext);
            TicketController ticketController = new TicketController(ticketService);

            List<TicketListVm> result = await ticketController.GetTickets();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Id);
            Assert.AreEqual(_price1, result[0].Price);
            Assert.AreEqual(_seat1, result[0].Seat);
            Assert.AreEqual(2, result[1].Id);
            Assert.AreEqual(_price2, result[1].Price);
            Assert.AreEqual(_seat2, result[1].Seat);
        }

        [Test]
        public async Task ShouldGetTicketById()
        {
            CreateTickets();

            TicketService ticketService = new TicketService(_dbContext);
            TicketController ticketController = new TicketController(ticketService);

            ActionResult<TicketVm> result1 = await ticketController.GetTicket(1);
            TicketVm returnedTicket1 = result1.Value;
            Assert.AreEqual(1, returnedTicket1.Id);
            Assert.AreEqual(_price1, returnedTicket1.Price);
            Assert.AreEqual(_seat1, returnedTicket1.Seat);

            ActionResult<TicketVm> result2 = await ticketController.GetTicket(2);
            TicketVm returnedTicket2 = result2.Value;
            Assert.AreEqual(2, returnedTicket2.Id);
            Assert.AreEqual(_price2, returnedTicket2.Price);
            Assert.AreEqual(_seat2, returnedTicket2.Seat);
        }

        [Test]
        public async Task ShouldCreateTicket()
        {
            CreateTickets();

            int price3 = 30;
            string seat3 = "seat 3";

            TicketService ticketService = new TicketService(_dbContext);
            TicketController ticketController = new TicketController(ticketService);

            TicketVm ticketVm = new TicketVm { Price = price3, Seat = seat3 };

            ActionResult<TicketVm> result = await ticketController.CreateTicket(ticketVm);

            TicketVm createdTicket = (TicketVm)((OkObjectResult)result.Result).Value;

            // Check object that is returned from the controller
            Assert.AreEqual(3, createdTicket.Id);
            Assert.AreEqual(price3, createdTicket.Price);
            Assert.AreEqual(seat3, createdTicket.Seat);

            // Check what we really have in the DB
            Ticket ticket1 = _dbContext.Tickets.Find(3);
            Assert.AreEqual(3, ticket1.Id);
            Assert.AreEqual(price3, ticket1.Price);
            Assert.AreEqual(seat3, ticket1.Seat);
        }

        [Test]
        public async Task ShouldUpdateTicket()
        {
            CreateTickets();

            int newPrice = 50;
            string newSeat = "Seat 4";

            TicketService ticketService = new TicketService(_dbContext);
            TicketController ticketController = new TicketController(ticketService);

            TicketVm ticketVm = new TicketVm { Id = 1, Price = newPrice, Seat = newSeat };

            await ticketController.UpdateTicket(ticketVm);

            // Check that only one has been changed
            Ticket ticket1 = _dbContext.Tickets.Find(1);
            Assert.AreEqual(newPrice, ticket1.Price);
            Assert.AreEqual(newSeat, ticket1.Seat);

            Ticket ticket2 = _dbContext.Tickets.Find(2);
            Assert.AreEqual(_price2, ticket2.Price);
            Assert.AreEqual(_seat2, ticket2.Seat);
        }

        [Test]
        public async Task ShouldDeleteTicket()
        {
            CreateTickets();

            TicketService ticketService = new TicketService(_dbContext);
            TicketController ticketController = new TicketController(ticketService);

            TicketVm ticketVm = new TicketVm { Id = 1 };

            ActionResult<TicketVm> result = await ticketController.DeleteTicket(ticketVm);
            TicketVm deletedTicket = (TicketVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedTicket.Id);

            // Check that we have deleted only the first, but not the other
            Ticket ticket1 = _dbContext.Tickets.Find(1);
            Assert.IsNull(ticket1);
            Ticket ticket2 = _dbContext.Tickets.Find(2);
            Assert.IsNotNull(ticket2);
        }

        // Helper methods
        private void CreateTickets()
        {
            _dbContext.Tickets.Add(new Ticket { Price = _price1, Seat = _seat1 });
            _dbContext.SaveChanges();
            _dbContext.Tickets.Add(new Ticket { Price = _price2, Seat = _seat2 });
            _dbContext.SaveChanges();
        }
    }
}
