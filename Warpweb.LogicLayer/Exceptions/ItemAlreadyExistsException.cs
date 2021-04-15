using System;

namespace Warpweb.LogicLayer.Exceptions
{
    // TODO : Implement exception
    public class ItemAlreadyExistsException : Exception
    {
        public ItemAlreadyExistsException(string message) : base(message)
        {
        }
    }
}
