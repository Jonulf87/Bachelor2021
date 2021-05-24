using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.DataAccessLayer.Models;

namespace Warpweb.WebLayer.HostedServices
{
    public class RefreshTokenFlushService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public RefreshTokenFlushService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetService<ApplicationDbContext>();

                var tokensToDelete = await dbContext.RefreshTokens
                    .Where(a => a.IsRevoked || a.IsUsed)
                    .ToListAsync(stoppingToken);

                dbContext.RemoveRange(tokensToDelete);

                await dbContext.SaveChangesAsync(stoppingToken);

                await Task.Delay(TimeSpan.FromHours(2), stoppingToken);
            }
        }
    }
}
