using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class ReportsControllerTest : BaseTest
    {
              
        [Test]
        public async Task ShouldGetGendersReport()
        {
            ReportsService reportsService = new ReportsService(_dbContext, _mainEventProvider);
            ReportsController reportsController = new ReportsController(reportsService);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);

            // Male
            SetUser(ticketController, _createdUser1.Entity.Id);

            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await ticketController.PurchaseTicketsAsync(tickets);

            var result = await reportsController.GetGendersReportAsync();
            var raport = (GendersReportVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, raport.MaleAmount);
            Assert.AreEqual(0, raport.FemaleAmount);
            Assert.AreEqual(0, raport.OtherAmount);
            Assert.AreEqual(0, raport.NotDisclosedAmount);

            // Female
            SetUser(ticketController, _createdUser2.Entity.Id);

            tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await ticketController.PurchaseTicketsAsync(tickets);

            result = await reportsController.GetGendersReportAsync();
            raport = (GendersReportVm)((OkObjectResult)result.Result).Value;

            Assert.AreEqual(1, raport.MaleAmount);
            Assert.AreEqual(1, raport.FemaleAmount);
            Assert.AreEqual(0, raport.OtherAmount);
            Assert.AreEqual(0, raport.NotDisclosedAmount);
        }

        [Test]
        public async Task ShouldGetAllergiesReport()
        {
            ReportsService reportsService = new ReportsService(_dbContext, _mainEventProvider);
            ReportsController reportsController = new ReportsController(reportsService);
            SetUser(reportsController, _createdUser2.Entity.Id);

            var result = await reportsController.GetAllergiesReportAsync();
            var raport = result.Value;

            Assert.AreEqual(1, raport.Count);
            Assert.AreEqual(_createdUser2.Entity.AllergyDescription, raport[0].AllergyDescription);
            Assert.AreEqual(_createdUser2.Entity.FirstName, raport[0].FirstName);
            Assert.AreEqual(_createdUser2.Entity.LastName, raport[0].LastName);


        }

        [Test]
        public async Task ShouldGetTicketTypesReport()
        {
            ReportsService reportsService = new ReportsService(_dbContext, _mainEventProvider);
            ReportsController reportsController = new ReportsController(reportsService);

            TicketService ticketService = new TicketService(_dbContext, _mainEventProvider);
            TicketController ticketController = new TicketController(ticketService);
            SetUser(ticketController, _createdUser2.Entity.Id);
            List<TicketsToBuyVm> tickets = new List<TicketsToBuyVm>();
            tickets.Add(new TicketsToBuyVm { Id = 1 });
            await ticketController.PurchaseTicketsAsync(tickets);


            var result = await reportsController.GetTicketTypesReportAsync();
            var raport = result.Value;

            Assert.AreEqual(2, raport[0].AmountSold);
            Assert.AreEqual("Test ticket type", raport[0].DescriptionName);

        }
    }
}
