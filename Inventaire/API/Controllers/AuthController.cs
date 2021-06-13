using API.Entities.DTOs;
using API.Orchestrators;
using API.Services.Abstraction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        private readonly Orchestrator _orchestrator;

        public AuthController(IAuthService authService, Orchestrator orchestrator)
        {
            _authService = authService;
            _orchestrator = orchestrator;
        }

        [HttpPost("login")]
        public ActionResult<AuthData> Login([FromBody] LoginDTO credentials)
        {
            try
            {
                var res = _orchestrator.Login(credentials);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterDTO newUser)
        {
            try
            {
                var res = await _orchestrator.Register(newUser);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }

        [Authorize]
        [HttpGet("sessionUpdate/{userId}")]
        public async Task<ActionResult<AuthData>> UpdateUser(Guid userId)
        {
            try
            {
                var res = await _orchestrator.UpdateSessionUser(userId);
                return res.FormatRes();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}