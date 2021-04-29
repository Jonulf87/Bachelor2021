using Microsoft.AspNetCore.Authorization;
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
    [Route("api/reports")]
    [Authorize]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsService _reportsService;

        public ReportsController(ReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        /// <summary>
        /// Returns count of different genders across participants for current event
        /// </summary>
        [HttpGet]
        [Route("participantsgenderreport")]
        public async Task<ActionResult<GendersReportVm>> GetGendersReportAsync()
        {
            try
            {
                GendersReportVm report = await _reportsService.GetGendersReportAsync();
                return Ok(report);
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Returns participants with allergies for current event
        /// </summary>
        [HttpGet]
        [Route("allergiesreport")]
        public async Task<List<AllergyReportListVm>> GetAllergiesReportAsync()
        {
            return await _reportsService.GetAllergiesReportAsync();
        }
    }
}
