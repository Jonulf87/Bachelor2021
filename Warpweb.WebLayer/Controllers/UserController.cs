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

        public UserController(UserService userService, SecurityService securityService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userService = userService;
            _securityService = securityService;
            _userManager = userManager;
            _signInManager = signInManager;
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
        [Route("register")]
        public async Task<ActionResult> RegisterUserAsync(UserVm user)
        {
            try
            {
                await _securityService.RegisterUserAsync(user);
            }
            catch (UserAlreadyExistsException)
            {
                return BadRequest("User already exist.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginUserAsync(LoginUserVm postedUser)
        {
            var user = await _userManager.FindByEmailAsync(postedUser.UserName) ?? await _userManager.FindByNameAsync(postedUser.UserName);

            if (user != null && !user.EmailConfirmed)
            {
                return BadRequest("E-Mailen er ikke bekreftet");
            }
            if (!await _userManager.CheckPasswordAsync(user, postedUser.Password))
            {
                return BadRequest("Feil i innlogging");
            }

            var result = await _signInManager.PasswordSignInAsync(user, postedUser.Password, true, true); //IsPersitant må oppdateres til å være en checkbox for "husk meg" type

            if (result.Succeeded)
            {
                return Ok();
            }
            else if (result.IsLockedOut)
            {
                return BadRequest("Du er låst ute. Kontakt en administrator for hjelp.");
            }
            else
            {
                return BadRequest("Kan ikke logge på. Prøv igjen senere eller kontakt administrator.");
            }
        }
    }
}
