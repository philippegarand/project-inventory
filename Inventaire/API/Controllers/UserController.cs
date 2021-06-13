using System;
using API.Services.Abstraction;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Authorization;
using Repository.Models.Enums;
using API.Orchestrators;
using API.Entities.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _UService;

        private readonly Orchestrator _orchestrator;

        public UserController(IUserService _uService, Orchestrator orchestrator)
        {
            _UService = _uService;
            _orchestrator = orchestrator;
        }

        [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER)]
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            try
            {
                return this._UService.Get().FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER)]
        [Route("employee")]
        [HttpPost]
        public async Task<ActionResult<User>> PostEmployee([FromBody] AddEmployeeDTO dto)
        {
            try
            {
                return (await this._orchestrator.AddEmployee(dto)).FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER)]
        [Route("employee")]
        [HttpPatch]
        public async Task<ActionResult> PutEmployee([FromBody] ModifyEmployeeDTO dto)
        {
            try
            {
                return (await this._orchestrator.ModifyEmployee(dto)).FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [Route("{id}/email")]
        [HttpPatch]
        public async Task<ActionResult<User>> UpdateEmail([FromBody] string newEmail, Guid id)
        {
            return (await this._UService.UpdateEmail(newEmail, id)).FormatRes();
        }

        [Route("{id}/password")]
        [HttpPatch]
        public async Task<ActionResult<User>> UpdatePassword([FromBody] ChangePasswordDTO userInfo, Guid id)
        {
            return (await this._UService.UpdatePassword(userInfo, id)).FormatRes();
        }

        //[AuthorizeRoles(AccountTypeEnum.ADMIN, AccountTypeEnum.MANAGER)]
        //[HttpPost]
        //public async Task<ActionResult<User>> Add([FromBody] User user)
        //{
        //    return (await this._UService.Add(user)).FormatRes();
        //}
    }
}