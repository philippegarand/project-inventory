using API.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER, AccountTypeEnum.EMPLOYEE)]
    [Route("api/[controller]")]
    public class ProductRentedController : ControllerBase
    {
        private IBaseService<ProductRented, Guid> _prService;

        public ProductRentedController(IBaseService<ProductRented, Guid> service)
        {
            _prService = service;
        }

        //[HttpGet]
        //public ActionResult<IEnumerable<ProductRented>> Get()
        //{
        //    try
        //    {
        //        return (_prService.Get()).FormatRes();
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, e);
        //    }
        //}

        //[HttpPost]
        //public async Task<ActionResult> Post([FromBody] ProductRented pr)
        //{
        //    try
        //    {
        //        return (await _prService.Add(pr)).FormatRes();
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, e);
        //    }
        //}
    }
}