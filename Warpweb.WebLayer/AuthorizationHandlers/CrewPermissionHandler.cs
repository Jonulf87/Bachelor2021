using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Warpweb.LogicLayer.Services;
using Warpweb.WebLayer.Requirements;

namespace Warpweb.WebLayer.AuthorizationHandlers
{
    public class CrewPermissionHandler : AuthorizationHandler<CrewPermissionRequirement>
    {
        private readonly SecurityService _securityService;

        public CrewPermissionHandler(SecurityService securityService)
        {
            _securityService = securityService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, CrewPermissionRequirement requirement)
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier);

            if (userId != null && await _securityService.HasCrewPermissionAsync(userId.Value, requirement.CrewPermissionType))
            {
                context.Succeed(requirement);
            }
        }
    }
}
