using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Configs;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class AuthControllerTest : BaseTest
    {
        private readonly string _userName = "Line@test.no";
        private readonly string _password = "123456";

        private readonly JwtConfig _jwtConfig = new JwtConfig();
        private UserManager<ApplicationUser> _userManager;
        private IOptionsMonitor<JwtConfig> _optionsMonitor;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private AuthController _authController;
        private Mock<IResponseCookies> _responseCookies;
        private Mock<IRequestCookieCollection> _requestCookies;

        [SetUp]
        public void LocalSetup()
        {
            _jwtConfig.Secret = "6dKNeF8jIOT3dNkitqMdUF5cmQMLFsiL"; // Random secret

            var serviceProvider = new ServiceCollection().AddLogging().BuildServiceProvider();
            var logger = serviceProvider.GetService<ILoggerFactory>().CreateLogger<UserManager<ApplicationUser>>();

            // Now we have to create password for this user
            // HashPassword-method needs already existing user, so we create password only AFTER we have created the user
            // The user is already created in BaseTest
            var hasher = new PasswordHasher<ApplicationUser>();
            _createdUser2.Entity.PasswordHash = hasher.HashPassword(_createdUser2.Entity, _password);

            UserStore<ApplicationUser> store = new UserStore<ApplicationUser>(_dbContext);
            _userManager = new UserManager<ApplicationUser>(store, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, logger);
            _optionsMonitor = Mock.Of<IOptionsMonitor<JwtConfig>>(_ => _.CurrentValue == _jwtConfig);

            _authController = new AuthController(_userManager, _optionsMonitor, _tokenValidationParameters, _dbContext);

            // Create HTTP things
            _responseCookies = new Mock<IResponseCookies>(); // Mock.Of<IResponseCookies>();
            var response = Mock.Of<HttpResponse>(_ => _.Cookies == _responseCookies.Object);

            _requestCookies = new Mock<IRequestCookieCollection>();
            var request = Mock.Of<HttpRequest>(_ => _.Cookies == _requestCookies.Object);

            var httpContext = Mock.Of<HttpContext>(_ => _.Response == response && _.Request == request);

            _authController.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };
        }

        [Test]
        public async Task ShouldLogin()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = _userName, Password = _password });
            var objectResult = result as OkObjectResult;
            Assert.IsNotEmpty(((AuthResultVm)objectResult.Value).Token);

            var storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsFalse(storedToken.IsUsed);
            Assert.IsFalse(storedToken.IsRevoked);
            Assert.IsTrue(storedToken.AddedDate > DateTime.UtcNow.AddMinutes(-1));
            Assert.IsTrue(storedToken.ExpiryDate > DateTime.UtcNow.AddMonths(6).AddMinutes(-1));

            // Check that we have set cookie
            _responseCookies.Verify(
                x => x.Append(
                    "refreshToken",
                    storedToken.Token,
                    It.Is((CookieOptions co) => co.HttpOnly == true &&
                        co.Expires == storedToken.ExpiryDate &&
                        co.Secure == true &&
                        co.SameSite == SameSiteMode.Strict
                    )
                ),
                Times.Once
            );
        }

        [Test]
        public async Task ShouldNotLoginWrongUser()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = "WrongUser", Password = _password });
            var objectResult = result as BadRequestObjectResult;
            var errors = ((AuthResultVm)objectResult.Value).Errors;

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual("Ugyldig bruker eller passord", errors[0]);
        }

        [Test]
        public async Task ShouldNotLoginWrongPassword()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = _userName, Password = "WrongPassword" });
            var objectResult = result as BadRequestObjectResult;
            var errors = ((AuthResultVm)objectResult.Value).Errors;

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual("Ugyldig bruker eller passord", errors[0]);
        }

        [Test]
        public async Task ShouldLogout()
        {
            // Login
            await _authController.Login(new LoginUserVm { UserName = _userName, Password = _password });

            // Check that we have token in the DB and it is NOT revoked
            var storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsFalse(storedToken.IsRevoked);

            // Mock request cookies
            _requestCookies.Setup(x => x["refreshToken"]).Returns(storedToken.Token);

            // Logout
            var result = await _authController.Logout();
            Assert.AreEqual(200, ((OkResult)result).StatusCode);

            // Check that we have deleted refrechToken from the cookies
            _responseCookies.Verify(x => x.Delete("refreshToken"), Times.Once);

            // Check that we have token in the DB and it is revoked
            storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsTrue(storedToken.IsRevoked);
        }

        [Test]
        public async Task ShouldRefreshToken()
        {
            // Login
            await _authController.Login(new LoginUserVm { UserName = _userName, Password = _password });

            // Check that we have token in the DB and it is NOT revoked and is NOT used
            var storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsFalse(storedToken.IsRevoked);
            Assert.IsFalse(storedToken.IsUsed);

            // Mock request cookies
            _requestCookies.Setup(x => x["refreshToken"]).Returns(storedToken.Token);

            var result = await _authController.RefreshToken();
            Assert.AreEqual(200, ((OkObjectResult)result).StatusCode);

            // Check that we have OLD token in the DB and it is NOT revoked, but is used
            var oldStoredToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.Id == storedToken.Id);
            Assert.IsFalse(oldStoredToken.IsRevoked);
            Assert.IsTrue(oldStoredToken.IsUsed);

            // Check that we have NEW token in the DB and it is NOT revoked and is NOT used
            var newStoredToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id && a.Id != storedToken.Id);
            Assert.IsFalse(newStoredToken.IsRevoked);
            Assert.IsFalse(newStoredToken.IsUsed);
        }

        [Test]
        public async Task ShouldReturnBadRequestWhenRefreshNonExistingToken()
        {
            // Mock request cookies
            _requestCookies.Setup(x => x["refreshToken"]).Returns("1234567890");

            var result = await _authController.RefreshToken();
            var badRequest = (BadRequestObjectResult)result;
            Assert.AreEqual(400, badRequest.StatusCode);
            Assert.AreEqual(1, ((AuthResultVm)badRequest.Value).Errors.Count);
            Assert.AreEqual("Refreshtoken eksisterer ikke", ((AuthResultVm)badRequest.Value).Errors[0]);

            // Check that we have deleted refrechToken from the cookies
            _responseCookies.Verify(x => x.Delete("refreshToken"), Times.Once);
        }

        [Test]
        public async Task ShouldReturnBadRequestWhenRefreshUsedToken()
        {
            // Login
            await _authController.Login(new LoginUserVm { UserName = _userName, Password = _password });

            // Check that we have token in the DB and it is NOT revoked
            var storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsFalse(storedToken.IsRevoked);
            Assert.IsFalse(storedToken.IsUsed);

            // Mock request cookies
            _requestCookies.Setup(x => x["refreshToken"]).Returns(storedToken.Token);

            storedToken.IsUsed = true;

            var result = await _authController.RefreshToken();
            var badRequest = (BadRequestObjectResult)result;
            Assert.AreEqual(400, badRequest.StatusCode);
            Assert.AreEqual(1, ((AuthResultVm)badRequest.Value).Errors.Count);
            Assert.AreEqual("Refreshtoken er allerede brukt", ((AuthResultVm)badRequest.Value).Errors[0]);
        }

        [Test]
        public async Task ShouldReturnBadRequestWhenRefreshRevokedToken()
        {
            // Login
            await _authController.Login(new LoginUserVm { UserName = _userName, Password = _password });

            // Check that we have token in the DB and it is NOT revoked
            var storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsFalse(storedToken.IsRevoked);
            Assert.IsFalse(storedToken.IsUsed);

            // Mock request cookies
            _requestCookies.Setup(x => x["refreshToken"]).Returns(storedToken.Token);

            // Logout
            await _authController.Logout();

            // Check that we have token in the DB and it is revoked
            storedToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(a => a.UserId == _createdUser2.Entity.Id);
            Assert.IsTrue(storedToken.IsRevoked);
            Assert.IsFalse(storedToken.IsUsed);

            var result = await _authController.RefreshToken();
            var badRequest = (BadRequestObjectResult)result;
            Assert.AreEqual(400, badRequest.StatusCode);
            Assert.AreEqual(1, ((AuthResultVm)badRequest.Value).Errors.Count);
            Assert.AreEqual("Refreshtoken har blitt trukket tilbake", ((AuthResultVm)badRequest.Value).Errors[0]);
        }

        [Test]
        public async Task ShouldNotRefreshTokenIfDoesntExist()
        {
            var result = await _authController.RefreshToken();
            var badRequest = (BadRequestObjectResult)result;
            Assert.AreEqual(400, badRequest.StatusCode);
            Assert.AreEqual(1, ((AuthResultVm)badRequest.Value).Errors.Count);
            Assert.AreEqual("Refresh Tokens eksisterer ikke. Vennligst logg på igjen.", ((AuthResultVm)badRequest.Value).Errors[0]);
        }
    }
}
