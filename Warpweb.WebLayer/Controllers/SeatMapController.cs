﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/seatmap")]
    [ApiController]
    [Authorize]

    public class SeatMapController : ControllerBase
    {
        private readonly SeatMapService _seatMapService;

        public SeatMapController(SeatMapService seatMapService)
        {
            _seatMapService = seatMapService;
        }

        [HttpPost]
        [Route("storeseatmap")]
        public async Task<ActionResult> StoreRowsAsync(List<RowVm> seatMap)
        {
            await _seatMapService.SetRowsAsync(seatMap);
            return Ok();
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<RowVm>>> GetSeatMapAsync()
        {
            var seatMap = await _seatMapService.GetSeatMapAsync();
            return Ok(seatMap);
        }
    }
}
