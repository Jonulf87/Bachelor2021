using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class TicketControllerTest : BaseTest
    {

        [Test]
        public async Task ShouldGetTickets()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            ActionResult <List<TicketListVm>> result = await ticketController.GetAllTicketsOfUserAsync();
            List<TicketListVm> returnedTickets = result.Value;

            Assert.AreEqual(2, returnedTickets.Count);
            Assert.AreEqual(1, returnedTickets[0].Id);
        }


        [Test]
        public async Task ShouldGetTicketById()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);

            ActionResult<TicketVm> result1 = await ticketController.GetTicketAsync(1);
            TicketVm returnedTicket1 = result1.Value;
            Assert.AreEqual(1, returnedTicket1.Id);
            Assert.AreEqual(15, returnedTicket1.Price);


            ActionResult<TicketVm> result2 = await ticketController.GetTicketAsync(2);
            TicketVm returnedTicket2 = result2.Value;
            Assert.AreEqual(2, returnedTicket2.Id);
            Assert.AreEqual(10, returnedTicket2.Price);
        }

       [Test]
       public async Task ShouldGetAllTiccketsUserEvent()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            ActionResult<List<TicketListVm>> result = await ticketController.GetAllTiccketsUserEventAsync(1);
            List<TicketListVm> returnedTickets = (List<TicketListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(2, returnedTickets.Count);
            Assert.AreEqual("Event 1", returnedTickets[0].MainEventName);
            Assert.AreEqual(15, returnedTickets[0].Price);
            Assert.AreEqual("Test ticket type", returnedTickets[0].TicketType);
            Assert.AreEqual(_createdUser1.Entity.Id, returnedTickets[0].UserId);
            Assert.AreEqual("Test row name", returnedTickets[0].RowName);
            Assert.AreEqual("Event 1", returnedTickets[1].MainEventName);
            Assert.AreEqual(10, returnedTickets[1].Price);
            Assert.AreEqual("Test ticket type", returnedTickets[1].TicketType);
            Assert.AreEqual(_createdUser1.Entity.Id, returnedTickets[1].UserId);
        }

        [Test]
        public async Task ShouldGetAllUnpaidTickets()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            ActionResult<List<TicketListVm>> result = await ticketController.GetAllTicketsUserEventUnpaidAsync(1);
            List<TicketListVm> returnedTickets = (List<TicketListVm>)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, returnedTickets.Count);
            Assert.AreEqual("Event 1", returnedTickets[0].MainEventName);
            Assert.AreEqual(10, returnedTickets[0].Price);
            Assert.AreEqual("Test ticket type", returnedTickets[0].TicketType);
            Assert.AreEqual(_createdUser1.Entity.Id, returnedTickets[0].UserId);
        }

        [Test]
        public async Task ShouldUpdateTicket()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            int newPrice = 50;

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            TicketVm ticketVm = new TicketVm { Id = 1, Price = newPrice};

            await ticketController.UpdateTicketAsync(ticketVm);

            // Check that only one has been changed
            Ticket ticket1 = _dbContext.Tickets.Find(1);
            Assert.AreEqual(newPrice, ticket1.Price);

            Ticket ticket2 = _dbContext.Tickets.Find(2);
            Assert.AreEqual(10, ticket2.Price);
        }

        [Test]
        public async Task ShouldDeleteTicket()
        {
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await CreateTickets(tickets);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            TicketVm ticketVm = new TicketVm { Id = 1 };

            ActionResult<TicketVm> result = await ticketController.DeleteTicketAsync(ticketVm);
            TicketVm deletedTicket = (TicketVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, deletedTicket.Id);

            // Check that we have deleted only the first, but not the other
            Ticket ticket1 = _dbContext.Tickets.Find(1);
            Assert.IsNull(ticket1);
            Ticket ticket2 = _dbContext.Tickets.Find(2);
            Assert.IsNotNull(ticket2);
        }

        [Test]
        public async Task ShouldPurchaseTickets()
        {
            var ticketCountBefore = await _dbContext.Tickets
                    .Where(a => a.TicketTypeId == 1)
                    .CountAsync();

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await ticketController.PurchaseTicketsAsync(tickets);

            var ticketCountAfter = await _dbContext.Tickets
                    .Where(a => a.TicketTypeId == 1)
                    .CountAsync();

            // Check that amount of purchased tickes is now +1
            Assert.AreEqual(ticketCountBefore+1, ticketCountAfter);

            // Find tickets of this type
            var ticketsAfter = await _dbContext.Tickets
                    .Where(a => a.TicketTypeId == 1)
                    .ToListAsync();

            // One is created in BaseTest, one is created here
            Assert.AreEqual(2, ticketsAfter.Count);
            // Check the second (that is created here)
            Assert.AreEqual(true, ticketsAfter[1].IsPaid);
            Assert.AreEqual(10, ticketsAfter[1].AmountPaid);
        }

        [Test]
        public async Task ShouldReserveSeat()
        {

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            await ticketController.ReserveSeatAsync(1, 1);

            Ticket reservedTicket = _dbContext.Tickets.Find(1);
            Assert.AreEqual(1, reservedTicket.SeatId);
        }

        [Test]
        public void ShouldNotDeleteTicketIfDoesntExist()
        {
            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);

            var ex = Assert.ThrowsAsync<HttpException>(async () =>
            {
                ActionResult<TicketVm> result = await ticketController.DeleteTicketAsync(new TicketVm { Id = 123 });
            });
            Assert.That(ex.Message == "Fant ikke billetten");
           
        }


        // Helper methods
        private async Task<ActionResult> CreateTickets(List<TicketsToBuyVm> tickets)
        {
            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser1.Entity.Id);

            return await ticketController.CreateTicketsAsync(tickets);


        }
    }
}
