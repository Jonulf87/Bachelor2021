using Microsoft.AspNetCore.Mvc.Testing;
using System.Threading.Tasks;
using WarpTest.WebLayer.Controllers;
using Warpweb.WebLayer;
using Xunit;

namespace WarpTest.WebLayer.RestAPI
{
    public class CrewRoleApiTest : IClassFixture<CustomWebApplicationFactory>  
    {
        private readonly CustomWebApplicationFactory _factory;

        public CrewRoleApiTest(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }
        /*
        [Fact]
        public async Task ShouldGetCrewRolesAsync()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("api/CrewRoleController");

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("text/html; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

        
        [Test]
        public async Task ShouldGetCrewRolesAsync()
        {
            _server = new TestServer(
                new WebHostBuilder()
                .ConfigureServices(c => c.AddSingleton(options))
                .UseSetting("ConnectionStrings:DefaultConnection", _connection.ConnectionString)
                .UseStartup<Startup>()
                
                );
            _client = _server.CreateClient();

            var response = await _client.GetAsync("api/CrewRoleController");
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();

            Assert.Equals("Hello World!", responseString);
        }
        */
        /*
        private HttpSelfHostServer _server;
        private readonly string _baseAddress = string.Format("http://{0}:9090", Environment.MachineName);

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            HttpSelfHostConfiguration config = new HttpSelfHostConfiguration(_baseAddress);
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            config.Routes.MapHttpRoute("Default", "api/{controller}");
            _server = new HttpSelfHostServer(config);
            _server.OpenAsync().Wait();
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            // _server.Dispose();
            if (_server != null)
            {
                _server.CloseAsync().Wait();
            }
        }

        [Test]
        public void ShouldGetCrewRoles()
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.RequestUri = new Uri(_baseAddress + "/api/CrewRoleController");
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Method = HttpMethod.Get;

            HttpClient client = new HttpClient(_server);
            HttpResponseMessage response = client.SendAsync(request).Result;

            Assert.NotNull(response.Content);
        }
        */
    }
}
