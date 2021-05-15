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
    class SeatMapControllerTest : BaseTest
    {
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

        [Test]
        public async Task ShouldGetPublicSeatMap()
        {
            SeatMapService seatMapService = new SeatMapService(_dbContext, _mainEventProvider);
            SeatMapController seatMapController = new SeatMapController(seatMapService);
            CreateRows();

            ActionResult<IEnumerable<PublicRowVm>> publicRows = await seatMapController.GetPublicSeatMapAsync();
            List<PublicRowVm> rows = (List<PublicRowVm>)((OkObjectResult)publicRows.Result).Value;
            Assert.AreEqual(2, rows.Count);
            Assert.AreEqual(1, rows[0].Id);
            Assert.AreEqual("Test row name", rows[0].RowName);
            Assert.AreEqual(2, rows[1].Id);
            Assert.AreEqual("Test row name 2", rows[1].RowName);
            Assert.AreEqual(4, rows[1].XPos);
            Assert.AreEqual(2, rows[1].YPos);
            Assert.IsTrue(rows[1].IsVertical);
        }

        // Helper methods
        private void CreateRows()
        {
            _dbContext.Rows.Add(
                new Row
                {
                    Name = "Test row name 2",
                    XCoordinate = 4,
                    YCoordinate = 2,
                    isVertical = true,
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
