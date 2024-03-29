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
        /// Returns count of different genders across participants for active event
        /// </summary>
        [HttpGet]
        [Route("participantsgenderreport")]
        public async Task<ActionResult<GendersReportVm>> GetGendersReportAsync()
        {

                GendersReportVm report = await _reportsService.GetGendersReportAsync();
                return Ok(report);
        }

        /// <summary>
        /// Returns participants with allergies for active event
        /// </summary>
        [HttpGet]
        [Route("allergiesreport")]
        public async Task<ActionResult<List<AllergyReportListVm>>> GetAllergiesReportAsync()
        {
            return await _reportsService.GetAllergiesReportAsync();
        }

        /// <summary>
        /// Returns sold ticket types for active event
        /// </summary>
        [HttpGet]
        [Route("tickettypesreport")]
        public async Task<ActionResult<List<TicketTypesReportListVm>>> GetTicketTypesReportAsync()
        {
            return await _reportsService.GetTicketTypesReportAsync();
        }
    }
}
