using API.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Orchestrators;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER, AccountTypeEnum.EMPLOYEE)]
    [Route("api/[controller]")]
    public class ProductAvailabilityController : ControllerBase
    {
        private readonly IProductAvailabilityService _PAService;
        private readonly Orchestrator _orchestrator;

        public ProductAvailabilityController(IProductAvailabilityService _service, Orchestrator orchestrator)
        {
            _PAService = _service;
            _orchestrator = orchestrator;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProductAvailability>> Get()
        {
            try
            {
                return _PAService.GetInventory().FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpGet]
        [Route("warehouse/{Id}")]
        public ActionResult<IEnumerable<ProductAvailability>> GetByWarehouse(int Id)
        {
            try
            {
                return _PAService.GetByWarehouse(Id).FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductAvailability>> Post([FromBody] ProductAvailability pa)
        {
            try
            {
                var res = await _orchestrator.AddProductAvailability(pa);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPatch]
        public async Task<ActionResult<ProductAvailability>> UpdateQuantity([FromBody] ProductAvailability pa)
        {
            try
            {
                var res = await _orchestrator.UpdateQuantity(pa);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPut]
        public async Task<ActionResult<ProductAvailability>> AddOrUpdateQuantity([FromBody] ProductAvailability pa)
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.Name)?.Value;
                var res = await _orchestrator.AddOrUpdateProductAvailability(pa, userId);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}