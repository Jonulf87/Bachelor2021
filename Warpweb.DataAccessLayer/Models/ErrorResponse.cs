using System.Net;
using System.Text.Json;

namespace Warpweb.DataAccessLayer.Models
{
    /// <summary>
    /// The ErrorReponse class. Used by the ExceptionHandling Middleware to serialize Http Status codes.
    /// </summary>>
    public class ErrorResponse
    {
        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.InternalServerError;

        public string Message { get; set; } = "An unexpected error occurred.";

        public string ToJsonString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}