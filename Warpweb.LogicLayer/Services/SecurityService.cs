using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Warpweb.DataAccessLayer;
using Warpweb.LogicLayer.ViewModels;

namespace Warpweb.LogicLayer.Services
{
    public class SecurityService
    {
        private readonly ApplicationDbContext _dbContext;

        public SecurityService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /*public object GetOrganizers(string name)
        {
            return _dbContext.Organizers
                .Where()
            throw new NotImplementedException();
        }*/
    }
}
