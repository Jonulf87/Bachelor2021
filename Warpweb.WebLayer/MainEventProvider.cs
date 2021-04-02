using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Interfaces;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.WebLayer
{
    public class MainEventProvider : IMainEventProvider
    {
        private readonly int _mainEventId;

        public MainEventProvider(IHttpContextAccessor httpContextAccessor)
        {
            var currentUser = httpContextAccessor.HttpContext?.User;

            if(currentUser != null && currentUser.Identity.IsAuthenticated)
            {
                var mainEventId = currentUser.FindFirst("CurrentMainEventId")?.Value;

                int.TryParse(mainEventId, out _mainEventId);
            }
        }

        public int MainEventId => _mainEventId;
    }
}
