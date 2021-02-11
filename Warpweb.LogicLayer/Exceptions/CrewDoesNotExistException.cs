using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.Exceptions
{
    public class CrewDoesNotExistException : Exception
    {
        public CrewDoesNotExistException()
        {
        }

        public CrewDoesNotExistException(string message) : base(message)
        {
        }

        public CrewDoesNotExistException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
