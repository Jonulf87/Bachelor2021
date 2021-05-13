using Microsoft.AspNetCore.Mvc;
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

        /// <summary>
        /// Creates a new Row in a list of rows
        /// </summary>
        public async Task SetRowsAsync(List<RowVm> rowInfo)
        {
            var existingRowIds = rowInfo.Where(a => a.Id != 0).Select(a => a.Id).ToList();

            var rowsToDelete = await _dbContext.Rows.Where(a => !existingRowIds.Contains(a.Id)).ToListAsync();

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
                    var existingRow = await _dbContext.Rows.Include(a => a.TicketTypes).Include(a => a.Seats).SingleOrDefaultAsync(a => a.Id == row.Id);


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

                        var newRowSeats = row.Seats.Where(a => a.Id == 0).ToList();
                        var rowSeatsToDelete = existingRow.Seats.Where(a => !row.Seats.Any(b => b.Id == a.Id)).ToList();

                        foreach (var newRowSeat in newRowSeats)
                        {
                            existingRow.Seats.Add(new Seat { SeatNumber = newRowSeat.SeatNumber });
                        }

                        foreach (var rowSeatToDelete in rowSeatsToDelete)
                        {
                            existingRow.Seats.Remove(rowSeatToDelete);
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

        /// <summary>
        /// Returns List of Rows available for orgadmin
        /// </summary>
        public async Task<IEnumerable<RowVm>> GetSeatMapAsync()
        {
            return await _dbContext.Rows
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

        /// <summary>
        /// Returns List of Rows available for public
        /// </summary>
        public async Task<IEnumerable<PublicRowVm>> GetPublicSeatMapAsync()
        {
            var rows = await _dbContext.Rows
                .Where(a => a.MainEventId == _mainEventProvider.MainEventId)
                .IgnoreQueryFilters()
                .Select(a => new PublicRowVm
                {
                    Id = a.Id,
                    IsVertical = a.isVertical,
                    XPos = a.XCoordinate,
                    YPos = a.YCoordinate,
                    RowName = a.Name,
                    Seats = a.Seats.Select(b => new PublicSeatVm { Id = b.Id, SeatNumber = b.SeatNumber, IsReserved = b.IsReserved }).ToList(),
                    TicketTypeIds = a.TicketTypes.Select(c => c.Id).ToList()
                }).ToListAsync();
            return rows;
        }
    }
}
