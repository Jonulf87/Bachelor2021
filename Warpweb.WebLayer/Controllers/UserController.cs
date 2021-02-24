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
    //[Authorize(Roles = "Users")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<List<UserListVm>> GetUsersAsync()
        {
            return await _userService.GetUsersAsync();
        }

        [HttpGet("${id}")]
        public async Task<UserVm> GetUserAsync(string id)
        {
            return await _userService.GetUserAsync(id);
        }
    }
}
