using System;
using API.Services.Abstraction;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Authorization;
using Repository.Models.Enums;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER, AccountTypeEnum.EMPLOYEE)]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly IBaseService<Category, int> _categoryService;

        public CategoryController(IBaseService<Category, int> categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> Get()
        {
            try
            {
                return this._categoryService.Get().FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Category>> Post([FromBody] Category category)
        {
            try
            {
                return (await this._categoryService.Add(category)).FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}