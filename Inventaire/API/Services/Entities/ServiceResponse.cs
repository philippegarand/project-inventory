using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Services.Entities
{
    public class ServiceResponse<T>
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

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
