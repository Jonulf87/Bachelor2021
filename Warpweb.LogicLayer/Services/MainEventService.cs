using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;

namespace Warpweb.LogicLayer.Services
{
    public class MainEventService
    {
        private readonly ApplicationDbContext _dbContext;

        public MainEventService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
