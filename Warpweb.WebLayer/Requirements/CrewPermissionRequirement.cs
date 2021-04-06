using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.WebLayer.Requirements
{
    public class CrewPermissionRequirement : IAuthorizationRequirement
    {
        public CrewPermissionRequirement(CrewPermissionType crewPermissionType)
        {
            CrewPermissionType = crewPermissionType;
        }

        public CrewPermissionType CrewPermissionType { get; }
    }
}
