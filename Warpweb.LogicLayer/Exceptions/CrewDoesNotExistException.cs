using System;

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
