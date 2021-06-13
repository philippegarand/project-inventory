using API.Entities.Views;
using API.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER)]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _hService;

        public HistoryController(IHistoryService _service)
        {
            _hService = _service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<HistoryView>> Get()
        {
            try
            {
                var res = _hService.GetLogs();
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}