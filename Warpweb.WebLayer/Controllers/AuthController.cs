﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Configs;

namespace Warpweb.WebLayer.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtConfig _jwtConfig;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private readonly ApplicationDbContext _applicationDbContext;

        public AuthController(UserManager<ApplicationUser> userManager, IOptionsMonitor<JwtConfig> optionsMonitor, TokenValidationParameters tokenValidationParameters, ApplicationDbContext applicationDbContext)
        {
            _userManager = userManager;
            _jwtConfig = optionsMonitor.CurrentValue;
            _tokenValidationParameters = tokenValidationParameters;
            _applicationDbContext = applicationDbContext;
        }

        /// <summary>
        /// Log out
        /// </summary>
        [HttpPost]
        [Route("logout")]
        public async Task<ActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                var storedToken = await _applicationDbContext.RefreshTokens.FirstOrDefaultAsync(a => a.Token == refreshToken);

                if (storedToken != null)
                {
                    storedToken.IsRevoked = true;

                    await _applicationDbContext.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        /// <summary>
        /// Log in
        /// </summary>
        /// <param name="user"></param> 
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserVm user)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await _userManager.FindByEmailAsync(user.UserName) ?? await _userManager.FindByNameAsync(user.UserName);

                if (existingUser == null)
                {
                    return BadRequest(new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Ugyldig bruker eller passord"
                        }
                    });
                }

                var passwordIsCorrect = await _userManager.CheckPasswordAsync(existingUser, user.Password);

                if (!passwordIsCorrect)
                {
                    return BadRequest(new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Ugyldig bruker eller passord"
                        }
                    });
                }

                var jwtToken = await GenerateJwtToken(existingUser);

                return Ok(jwtToken);
            }

            return BadRequest(new AuthResultVm()
            {
                Errors = new List<string>() {
                    "Ugyldig data innsendt"
                }
            });
        }

        /// <summary>
        /// Refresh JWT token
        /// </summary>
        [HttpPost]
        [Route("refreshtoken")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(new AuthResultVm()
                {
                    Errors = new List<string>()
                    {
                         "Refresh Tokens eksisterer ikke. Vennligst logg på igjen."
                    }
                });
            }

            var result = await VerifyAndGenerateToken(refreshToken);

            if (result == null)
            {
                Response.Cookies.Delete("refreshToken");

                return BadRequest(new AuthResultVm()
                {
                    Errors = new List<string>()
                    {
                        "Ugyldig token"
                    }
                });
            }
            else if (result.Errors != null && result.Errors.Count > 0)
            {
                Response.Cookies.Delete("refreshToken");
                return BadRequest(result);
            }
            return Ok(result);
        }

        /// <summary>
        /// Helper method to return id of main event
        /// </summary>
        /// <param name="user"></param>
        private static string GetMainEventId(ApplicationUser user)
        {
            
            return user.CurrentMainEventId != null ? user.CurrentMainEventId.ToString() : "0";
            //return user.CurrentMainEventId?.ToString() ?? "0"; //Denne gjør det samme som over. Hvis null, returner verdi etter ??, hvis ikke null returner før ??
        }

        /// <summary>
        /// Helper method for generating JWT Token
        /// </summary>
        /// <param name="user"></param>
        /// <returns>AuthResultVm</returns>
        private async Task<AuthResultVm> GenerateJwtToken(ApplicationUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);

            var isOrgAdmin = await _applicationDbContext.Organizers.AnyAsync(a => a.Admins.Any(b => b.Id == user.Id));

            var claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("CurrentMainEventId", GetMainEventId(user)),
                new Claim("IsOrgAdmin", isOrgAdmin.ToString())
            
            });

            foreach (var role in await _userManager.GetRolesAsync(user))
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = DateTime.UtcNow.AddMinutes(5), // 5-10 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                IsUsed = false,
                IsRevoked = false,
                UserId = user.Id,
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6),
                Token = RandomString()
            };

            await _applicationDbContext.RefreshTokens.AddAsync(refreshToken);
            await _applicationDbContext.SaveChangesAsync();

            SetTokenCookie(refreshToken.Token, refreshToken.ExpiryDate);

            return new AuthResultVm()
            {
                Token = jwtToken
            };
        }

        /// <summary>
        /// Helper method to verify and generate Token
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns>AuthResultVm</returns>
        private async Task<AuthResultVm> VerifyAndGenerateToken(string refreshToken)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                
                // validate existence of the token
                var storedToken = await _applicationDbContext.RefreshTokens.FirstOrDefaultAsync(a => a.Token == refreshToken);

                if (storedToken == null)
                {
                    return new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Refreshtoken eksisterer ikke"
                        }
                    };
                }

                // validate if used
                if (storedToken.IsUsed)
                {
                    return new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Refreshtoken er allerede brukt"
                        }
                    };
                }

                // validate if revoked
                if (storedToken.IsRevoked)
                {
                    return new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Refreshtoken har blitt trukket tilbake"
                        }
                    };
                }
                                
                // update current token 
                storedToken.IsUsed = true;
                await _applicationDbContext.SaveChangesAsync(); // EF har autotracker for endringer

                // Generate a new token
                var dbUser = await _userManager.FindByIdAsync(storedToken.UserId);
                return await GenerateJwtToken(dbUser);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Lifetime validation failed. The token is expired."))
                {
                    return new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "Token er utløpt. Vennligst log inn på nytt"
                        }
                    };
                }
                else
                {
                    return new AuthResultVm()
                    {
                        Errors = new List<string>() {
                            "uWu. I made a poo poo."
                        }
                    };
                }
            }
        }

        /// <summary>
        /// Helper method to generate random string with RNGCryptoServiceProvider
        /// </summary>
        /// <returns></returns>
        private string RandomString()
        {
            using(var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);

                return Convert.ToBase64String(randomBytes);
            }
        }

        /// <summary>
        /// Helper method to set cookie
        /// </summary>
        /// <param name="token"></param>
        /// <param name="expirationDate"></param>
        private void SetTokenCookie(string token, DateTime expirationDate)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = expirationDate,
                Secure = true,
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}

