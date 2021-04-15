using System;

namespace Warpweb.LogicLayer.Exceptions
{
    public class ItemNotFoundException : Exception
    {

        public ItemNotFoundException(string message) : base(message)
        {
        }
    }
}
