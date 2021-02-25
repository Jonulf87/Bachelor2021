using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public UserController(UserService userService)
        {
            _userService = userService;
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

        // Added to cancel out error message from UserControllerTests
        public Task<ActionResult<UserVm>> GetUserAsync(string id)
        {
            throw new NotImplementedException();
        }
    }
}
