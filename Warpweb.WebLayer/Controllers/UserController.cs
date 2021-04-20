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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserController(UserService userService, SecurityService securityService, 
            UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userService = userService;
            _securityService = securityService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        /// <summary>
        /// Returns all users
        /// </summary>
        /// <returns>UserListVM</returns>
        [HttpGet]
        [Route("userslist")]
        [Authorize(Roles = "Admin")]
        public async Task<List<UserListVm>> GetUsersAsync()
        {

            return await _userService.GetUsersAsync();
        }

        /// <summary>
        /// Returns current logged in user
        /// </summary>
        /// <returns>UserVM</returns>
        [HttpGet]
        [Route("currentuser")]
        public async Task<UserVm> GetCurrentUserAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);

            return await _userService.GetCurrentUserAsync(userId.Value);
        }

        /// <summary>
        /// Returns specific user
        /// </summary>
        /// <param name="userId"></param>  
        /// <returns>UserVM</returns>
        [HttpGet]
        [Route("user/{userId}")]
        [Authorize(Roles = "Admin")]
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
            try
            {
                await _securityService.RegisterUserAsync(user);
                return Ok();
            }
            catch (ItemAlreadyExistsException)
            {
                return BadRequest("Brukeren eksisterer allerede");
            }
            catch (Exception)
            {
                return BadRequest("Noe gikk galt.");
            }
            
        }  
    }
}
