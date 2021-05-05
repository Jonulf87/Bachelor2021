using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Warpweb.DataAccessLayer.Models;
using Warpweb.LogicLayer.Exceptions;
using Microsoft.Extensions.Logging;

namespace Warpweb.WebLayer.Controllers
{
    // Implementation based on https://medium.com/swlh/how-to-make-your-net-api-fail-gracefully-86067128fa10
    /// <summary>
    /// Custom Exception Handling Middleware. The exception handler will intercept all exceptions
    /// and return either a Http status code message, or a 500 error.
    /// </summary>
    
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(context, exception);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var errorResponse = new ErrorResponse();

            if (exception is HttpException httpException)
            {
                errorResponse.StatusCode = httpException.StatusCode;
                errorResponse.Message = httpException.Message;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)errorResponse.StatusCode;
            await context.Response.WriteAsync(errorResponse.ToJsonString());
        }
    }
}