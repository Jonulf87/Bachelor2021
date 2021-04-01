using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class SeatMapService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMainEventProvider _mainEventProvider;

        public SeatMapService(ApplicationDbContext dbContext, IMainEventProvider mainEventProvider)
        {
            _dbContext = dbContext;
            _mainEventProvider = mainEventProvider;
        }


        //hvordan fikse error handling og return når det er et array av objekter som sendes inn?
        public async Task SetRowsAsync(List<RowVm> rowInfo) 
        {


            foreach (var row in rowInfo)
            {
                var newRow = new Row
                {
                    Name = row.RowName,
                    XCoordinate = row.XPos,
                    YCoordinate = row.YPos,
                    isVertical = row.IsVertical,
                    MainEventId = 1,
                    Seats = new List<Seat>()
                };
                    
                foreach (var seat in row.Seats)
                {
                    newRow.Seats.Add(new Seat
                    {
                        SeatNumber = seat.SeatNumber.ToString(),
                        isReserved = false,
                        isBought = false
                    });
                }

                _dbContext.Rows.Add(newRow);
            }

            await _dbContext.SaveChangesAsync();
        }

        //public async Task<int> SetSeatsAsync(List<SeatVm> seatInfo)
        //{
        //    foreach (var seatObject in seatInfo)
        //    {

        //    }
        //}
    }
}
