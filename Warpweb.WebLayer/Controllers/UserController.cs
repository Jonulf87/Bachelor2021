using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Warpweb.LogicLayer.Services;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly SecurityService _securityService;

        public UserController(UserService userService, SecurityService securityService)
        {
            _userService = userService;
            _securityService = securityService;
        }

        [HttpGet]
        [Route("UsersList")]
        public async Task<List<UserListVm>> GetUsersAsync()
        {
            return await _userService.GetUsersAsync();
        }

        [HttpGet]
        public async Task<UserVm> GetUserAsync()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            return await _userService.GetUserAsync(userId.Value);
        }

        [HttpGet]
        [Route("UserRoles/{id}")]
        public async Task<List<UserRolesListVm>> GetUserRolesAsync(string id)
        {
            return await _securityService.GetUserRolesAsync(id);

        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/register")]
        public async Task<ActionResult<UserVm>> RegisterUserAsync(UserVm user)
        {
            return await _securityService.RegisterUserAsync(user);
        }
    }
}
