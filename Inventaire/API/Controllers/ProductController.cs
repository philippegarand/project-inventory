using API.Entities.Views;
using API.Orchestrators;
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
    public class ProductController : ControllerBase
    {        
        private IProductService _pService;

        private readonly Orchestrator _orchestrator;

        public ProductController(IProductService service, Orchestrator orchestrator)
        {
            _pService = service;
            _orchestrator = orchestrator;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll()
        {
            try
            {
                var res = _pService.Get();
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpGet]
        [Route("names")]
        public ActionResult<IEnumerable<ProductNamesView>> GetProductNames()
        {
            try
            {
                var res = _pService.GetProductNames();
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Product>> GetById(Guid id)
        {
            try
            {
                var res = await _pService.GetById(id);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Post([FromBody] Product product)
        {
            try
            {
                var res = await _orchestrator.AddProduct(product);
                return res.FormatRes();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPatch]
        [Route("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct([FromBody] Product product, Guid id)
        {
            try
            {
                product.ProductID = id;
                var res = await _orchestrator.UpdateProduct(product);
                return res.FormatRes();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}