using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

        /// <summary>
        /// Add seatmap
        /// </summary>
        /// <param name="seatMap"></param>
        [HttpPost]
        [Route("storeseatmap")]
        [Authorize(Policy = "SeatMapAdmin")]
        public async Task<ActionResult> StoreRowsAsync(List<RowVm> seatMap)
        {
            await _seatMapService.SetRowsAsync(seatMap);
            return Ok();
        }

        /// <summary>
        /// Returns seatmap
        /// </summary>
        [HttpGet]
        [Route("getseatmap")]
        public async Task<ActionResult<IEnumerable<RowVm>>> GetSeatMapAsync()
        {
            var seatMap = await _seatMapService.GetSeatMapAsync();
            return Ok(seatMap);
        }

        /// <summary>
        /// Gets seatmap meant for the public
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("publicseatmap")]
        public async Task<ActionResult<IEnumerable<PublicRowVm>>> GetPublicSeatMapAsync()
        {
            var seatMap = await _seatMapService.GetPublicSeatMapAsync();
            return Ok(seatMap);
        }

    }
}
