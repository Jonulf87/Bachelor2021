using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class SeatMapControllerTest : BaseTest
    {
        private readonly IMainEventProvider _mainEventProvider;

        [Test]
        public async Task ShouldStoreAndGetRows()
        {
            SeatMapService seatMapService = new SeatMapService(_dbContext, _mainEventProvider);
            SeatMapController seatMapController = new SeatMapController(seatMapService);
            CreateRows();

            List<RowVm> list = new List<RowVm>();
            list.Add(
                new RowVm { 
                    Id = 1, 
                    TicketTypeIds = new List<int> { 1 }, 
                    Seats = new List<SeatVm> { new SeatVm { Id = 1, SeatNumber = 5 } }
                }
            );
            list.Add(
                new RowVm
                {
                    Id = 2,
                    TicketTypeIds = new List<int> { 1 },
                    Seats = new List<SeatVm> { new SeatVm { Id = 2, SeatNumber = 5 } }
                }
            );

            await seatMapController.StoreRowsAsync(list);
            ActionResult<IEnumerable<RowVm>> seats = await seatMapController.GetSeatMapAsync();
            List<RowVm> rows = (List<RowVm>)((OkObjectResult)seats.Result).Value;

            Assert.AreEqual(2, rows.Count);

        }

        // Helper methods
        private void CreateRows()
        {
            _dbContext.Rows.Add(
                new Row
                {
                    Name = "Test row name 1",
                    MainEventId = 1
                }
            );
            _dbContext.SaveChanges();

            _dbContext.Seats.Add(
                new Seat
                {
                    SeatNumber = 2,
                    RowId = 2
                }
            );
            _dbContext.SaveChanges();

        }
    }
}
