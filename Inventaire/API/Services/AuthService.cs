using API.Helpers;
using API.Services.Abstraction;
using API.Services.Entities;
using Microsoft.IdentityModel.Tokens;
using Repository.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace API.Services
{
    // Reference: https://geekrodion.com/blog/asp-react-blog/authentication
    public class AuthService : IAuthService
    {
        private readonly string _jwtSecret;
        private readonly int _jwtLifespan;
        private readonly ISystemClock _systemClock;

        public AuthService(string jwtSecret, int jwtLifespan, ISystemClock systemClock)
        {
            _jwtSecret = jwtSecret;
            _jwtLifespan = jwtLifespan;
            _systemClock = systemClock;
        }

        public AuthData GetAuthData(User user)
        {
            var expirationTime = _systemClock.GetCurrentUtcTime().AddSeconds(_jwtLifespan);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserID.ToString()),
                    new Claim(ClaimTypes.Role, user.AccountTypeID.ToString()),
                }),
                Expires = expirationTime,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

            return new AuthData
            {
                AccessToken = token,
                TokenExpirationTime = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds(),
                Id = user.UserID.ToString(),
                Role = user.AccountTypeID,
                Name = user.Name,
                Email = user.Email,
                Warehouses = user.Warehouses.Select(x => new MinimalWarehouse { Id = x.WarehouseID, Name = x.Name }).ToList(),
            };
        }

        public ServiceResponse<AuthData> VerifyLogin(User user, string credentialsPassword)
        {
            if (!PasswordHelper.VerifHash(credentialsPassword, Convert.FromBase64String(user.Salt), Convert.FromBase64String(user.Password)))
                return new ServiceResponse<AuthData>(HttpStatusCode.NotFound, "Credentials are wrong");

            return new ServiceResponse<AuthData>(HttpStatusCode.OK, GetAuthData(user));
        }
    }
}