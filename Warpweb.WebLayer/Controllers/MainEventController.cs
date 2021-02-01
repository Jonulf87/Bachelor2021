using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Services;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/[arrangement]")]
    [ApiController]
    public class MainEventController : ControllerBase
    {
        private readonly MainEventService _mainEventService;

        public MainEventController(MainEventService mainEventService)
        {
            _mainEventService = mainEventService;
        }
    }
}
