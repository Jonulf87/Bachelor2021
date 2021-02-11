using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.LogicLayer.Exceptions
{
    // TODO : Implement exception
    public class CrewAlreadyExistsException : Exception
    {
        public CrewAlreadyExistsException()
        {
        }

        public CrewAlreadyExistsException(string message) : base(message)
        {
        }

        public CrewAlreadyExistsException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
