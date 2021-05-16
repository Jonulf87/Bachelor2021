using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
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

        /// <summary>
        /// Returns all users
        /// </summary>
        /// <returns>UserListVM</returns>
        [HttpGet]
        [Route("userslist")]
        public async Task<List<UserListVm>> GetUsersAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _userService.GetUsersAsync(userId);
        }

        /// <summary>
        /// Returns all users participating in specific event
        /// </summary>
        /// <returns>ParticipantListVM</returns>
        [HttpGet]
        [Route("participantslist")]
        public async Task<List<ParticipantListVm>> GetParticipantsAsync()
        {

            return await _userService.GetParticipantsAsync();
        }

        /// <summary>
        /// Returns current logged in user
        /// </summary>
        /// <returns>UserVM</returns>
        [HttpGet]
        [Route("currentuser")]
        public async Task<UserVm> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return await _userService.GetCurrentUserAsync(userId);
        }

        /// <summary>
        /// Returns specific user
        /// </summary>
        /// <param name="userId"></param>  
        /// <returns>UserVM</returns>
        [HttpGet]
        [Route("user/{userId}")]
        [Authorize(Policy = "UserAdmin")]
        public async Task<UserVm> GetUserAsync(string userId)
        {
            return await _userService.GetUserAsync(userId);
        }

        /// <summary>
        /// Returns specific user role
        /// </summary>
        /// <param name="userId"></param>  
        /// <returns>UserRolesListVM</returns>
        [HttpGet]
        [Route("userroles/{userId}")]
        [Authorize(Policy = "UserAdmin")]
        public async Task<List<UserRolesListVm>> GetUserRolesAsync(string userId)
        {
            return await _securityService.GetUserRolesAsync(userId);

        }

        /// <summary>
        /// Register new user
        /// </summary>
        /// <param name="user"></param>
        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> RegisterUserAsync(UserVm user)
        {
                await _securityService.RegisterUserAsync(user);
                return Ok();
        }

        /// <summary>
        /// Update user
        /// </summary>
        /// <param name="user"></param>
        [HttpPut]
        [Route("updateuser")]
        public async Task<ActionResult> UpdateUserAsync(UserUpdateVm user)
        {
            await _userService.UpdateUserAsync(user);
            return Ok();
        }

        /// <summary>
        /// Check if username exists
        /// </summary>
        /// <param name="userName"></param>
        [HttpGet]
        [Route("checkusername/{userName}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserNameCheckVm>> CheckUserNameAsync(string userName)
        {
            return await _userService.CheckUserNameAsync(userName);
        }

        /// <summary>
        /// Check if email exists
        /// </summary>
        /// <param eMail="eMail"></param>
        [HttpGet]
        [Route("checkemail/{eMail}")]
        [AllowAnonymous]
        public async Task<ActionResult<EMailCheckVm>> CheckEMailAsync(string eMail)
        {
            return await _userService.CheckEMailAsync(eMail);
        }
    }
}
