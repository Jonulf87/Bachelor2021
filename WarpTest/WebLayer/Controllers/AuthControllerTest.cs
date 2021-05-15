using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.ViewModels;
using Warpweb.WebLayer.Configs;
using Warpweb.WebLayer.Controllers;

namespace WarpTest.WebLayer.Controllers
{
    class AuthControllerTest : BaseTest
    {
        private readonly JwtConfig _jwtConfig = new JwtConfig();
        private UserManager<ApplicationUser> _userManager;
        private IOptionsMonitor<JwtConfig> _optionsMonitor;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private AuthController _authController;
        private Mock<IResponseCookies> _cookies;

        [SetUp]
        public void LocalSetup()
        {
            _jwtConfig.Secret = "6dKNeF8jIOT3dNkitqMdUF5cmQMLFsiL"; // Random secret

            var serviceProvider = new ServiceCollection().AddLogging().BuildServiceProvider();
            var logger = serviceProvider.GetService<ILoggerFactory>().CreateLogger<UserManager<ApplicationUser>>();

            // Now we have to create password for this user
            // HashPassword-method needs already existing user, so we create password only AFTER we have created the user
            var hasher = new PasswordHasher<ApplicationUser>();
            _createdUser2.Entity.PasswordHash = hasher.HashPassword(_createdUser2.Entity, "123456");

            UserStore<ApplicationUser> store = new UserStore<ApplicationUser>(_dbContext);
            _userManager = new UserManager<ApplicationUser>(store, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, logger);
            _optionsMonitor = Mock.Of<IOptionsMonitor<JwtConfig>>(_ => _.CurrentValue == _jwtConfig);

            _authController = new AuthController(_userManager, _optionsMonitor, _tokenValidationParameters, _dbContext);

            _cookies = new Mock<IResponseCookies>(); // Mock.Of<IResponseCookies>();
            var response = Mock.Of<HttpResponse>(_ => _.Cookies == _cookies.Object);
            var httpContext = Mock.Of<HttpContext>(_ => _.Response == response);

            _authController.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };
        }

        [Test]
        public async Task ShouldLogin()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = "Line@test.no", Password = "123456" });
            var objectResult = result as OkObjectResult;
            Assert.IsNotEmpty(((AuthResultVm)objectResult.Value).Token);

            // Check that we have set cookie 
            _cookies.Verify(x => x.Append("refreshToken", It.IsAny<string>(), It.IsAny<CookieOptions>()), Times.Once);
        }

        [Test]
        public async Task ShouldNotLoginWrongUser()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = "WrongUser", Password = "123456" });
            var objectResult = result as BadRequestObjectResult;
            var errors = ((AuthResultVm)objectResult.Value).Errors;

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual("Ugyldig bruker eller passord", errors[0]);
        }

        [Test]
        public async Task ShouldNotLoginWrongPassword()
        {
            var result = await _authController.Login(new LoginUserVm { UserName = "Line@test.no", Password = "WrongPassword" });
            var objectResult = result as BadRequestObjectResult;
            var errors = ((AuthResultVm)objectResult.Value).Errors;

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual("Ugyldig bruker eller passord", errors[0]);
        }
    }
}
