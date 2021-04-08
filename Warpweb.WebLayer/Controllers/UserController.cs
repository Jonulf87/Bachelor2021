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
        [HttpGet]
        [Route("userslist")]
        public async Task<List<UserListVm>> GetUsersAsync()
        {
            return await _userService.GetUsersAsync();
        }

        /// <summary>
        /// Returns current logged in user
        /// </summary>
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
        /// <param name="id"></param>  
        [HttpGet]
        [Route("user/{id}")]
        public async Task<UserVm> GetUserAsync(string id)
        {
            return await _userService.GetUserAsync(id);
        }

        /// <summary>
        /// Returns specific user role
        /// </summary>
        /// <param name="id"></param>  
        [HttpGet]
        [Route("userroles/{id}")]
        public async Task<List<UserRolesListVm>> GetUserRolesAsync(string id)
        {
            return await _securityService.GetUserRolesAsync(id);

        }

        /// <summary>
        /// Register new user
        /// </summary>
        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> RegisterUserAsync(UserVm user)
        {
            try
            {
                await _securityService.RegisterUserAsync(user);
            }
            catch (UserAlreadyExistsException)
            {
                return BadRequest("Brukeren eksisterer allerede");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        
    }
}
