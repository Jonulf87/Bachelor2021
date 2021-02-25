using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

[assembly: HostingStartup(typeof(Warpweb.WebLayer.Areas.Identity.IdentityHostingStartup))]
namespace Warpweb.WebLayer.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
            });
        }
    }
}