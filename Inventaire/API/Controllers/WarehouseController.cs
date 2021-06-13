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
    [Route("api/[controller]")]
    public class WarehouseController : ControllerBase
    {
        private readonly IBaseService<Warehouse, int> _wService;

        public WarehouseController(IBaseService<Warehouse, int> _service)
        {
            _wService = _service;
        }

        [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER, AccountTypeEnum.EMPLOYEE)]
        [HttpGet]
        public ActionResult<IEnumerable<Warehouse>> Get()
        {
            try
            {
                return _wService.Get().FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [AuthorizeRoles(AccountTypeEnum.ADMIN)]
        [HttpPost]
        public async Task<ActionResult<Warehouse>> Post([FromBody] Warehouse warehouse)
        {
            try
            {
                // TODO: add all admins in warehouse.Users ?
                return (await _wService.Add(warehouse)).FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}