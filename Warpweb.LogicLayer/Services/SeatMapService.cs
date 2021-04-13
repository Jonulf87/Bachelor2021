﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var existingRowIds = rowInfo.Where(a => a.Id != 0).Select(a => a.Id).ToList();

            var rowsToDelete = await _dbContext.Rows.Where(a => a.MainEventId == _mainEventProvider.MainEventId && !existingRowIds.Contains(a.Id)).ToListAsync();

            _dbContext.Rows.RemoveRange(rowsToDelete);


            foreach (var row in rowInfo)
            {
                if (row.Id == 0)
                {

                    var newRow = new Row
                    {
                        Name = row.RowName,
                        XCoordinate = row.XPos,
                        YCoordinate = row.YPos,
                        isVertical = row.IsVertical,
                        MainEventId = _mainEventProvider.MainEventId,
                        Seats = new List<Seat>()
                    };



                    if (row.TicketTypeIds != null)
                    {
                        newRow.TicketTypes = await _dbContext.TicketTypes.Where(a => row.TicketTypeIds.Contains(a.Id)).ToListAsync();
                    }

                    foreach (var seat in row.Seats)
                    {
                        newRow.Seats.Add(new Seat
                        {
                            SeatNumber = seat.SeatNumber
                        });
                    }

                    _dbContext.Rows.Add(newRow);
                }
                else
                {
                    var existingRow = await _dbContext.Rows.Include(a => a.TicketTypes).SingleOrDefaultAsync(a => a.Id == row.Id);


                    if (existingRow != null)
                    {
                        
                        var newRowTicketTypes = row.TicketTypeIds;

                        var rowTicketTypesToBeDeleted = existingRow.TicketTypes.Where(a => !newRowTicketTypes.Contains(a.Id)).ToList();
                        var rowTicketTypeIdsToAdd = newRowTicketTypes.Where(a => !existingRow.TicketTypes.Any(b => b.Id == a)).ToList();

                        foreach (var rowTicketTypeToDelete in rowTicketTypesToBeDeleted)
                        {
                            existingRow.TicketTypes.Remove(rowTicketTypeToDelete);
                        }

                        foreach (var rowTicketTypeIdToAdd in rowTicketTypeIdsToAdd)
                        {
                            var ticketType = await _dbContext.TicketTypes.Where(a => a.Id == rowTicketTypeIdToAdd).SingleOrDefaultAsync();
                            existingRow.TicketTypes.Add(ticketType);
                        }



                        existingRow.Name = row.RowName;
                        existingRow.XCoordinate = row.XPos;
                        existingRow.YCoordinate = row.YPos;
                        existingRow.isVertical = row.IsVertical;
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<RowVm>> GetSeatMapAsync()
        {
            return await _dbContext.Rows
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .Select(a => new RowVm
                {
                    Id = a.Id,
                    IsVertical = a.isVertical,
                    NumberOfSeats = a.Seats.Count,
                    XPos = a.XCoordinate,
                    YPos = a.YCoordinate,
                    RowName = a.Name,
                    Seats = a.Seats.Select(b => new SeatVm { Id = b.Id, SeatNumber = b.SeatNumber }).ToList(),
                    TicketTypeIds = a.TicketTypes.Select(c => c.Id).ToList()
                }).ToListAsync();
        }
    }
}
