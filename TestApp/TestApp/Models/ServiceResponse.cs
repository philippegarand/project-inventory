using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace TestApp.Models
{
    public class ServiceResponse<T>
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public ServiceResponse()
        {
        }

        public ServiceResponse(HttpStatusCode status, T obj, string msg = "")
        {
            StatusCode = status;
            Data = obj;
            Message = msg;
        }

        public ServiceResponse(HttpStatusCode status, string msg = "")
        {
            StatusCode = status;
            Message = msg;
        }

        public ObjectResult FormatRes() => new ObjectResult(new { Message, Data }) { StatusCode = (int)StatusCode };
    }
}