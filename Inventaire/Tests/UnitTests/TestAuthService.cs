using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using API.Services;
using Moq;
using Repository.Models;
using Tests.Builders;
using API.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using API.Services.Abstraction;
using Repository.Models.Enums;

namespace Tests.UnitTests
{
    [TestClass]
    public class TestAuthService
    {
        private AuthService authService;
        private const string JWTSECRET = "MsV0QVtYjWvMmclJFXs4xTngEMgFyBQ6TetDqs4F";
        private const int JWTLIFESPAN = 900;

        private Mock<ISystemClock> systemClockMock;

        [TestInitialize]
        public void TestInitialize()
        {
            systemClockMock = new Mock<ISystemClock>();
            authService = new AuthService(JWTSECRET, JWTLIFESPAN, systemClockMock.Object);   // Config values from json
        }

        [TestMethod]
        public void When_Getting_Auth_Data_Then_It_Is_Works()
        {
            var currentTime = DateTime.UtcNow;

            User user = new UserBuilder()
                .WithId(Guid.NewGuid())
                .WithAccountType(AccountTypeEnum.ADMIN)
                .WithName("World's Greatest Tester Is You")
                .WithEmail("TestsAre@Boring.com")
                .WithWarehouses(new List<Warehouse> { new Warehouse { WarehouseID = 1 } })
                .Build();

            // Creating expected result
            var expirationTime = currentTime.AddSeconds(JWTLIFESPAN);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.Name, user.UserID.ToString()),
                        new Claim(ClaimTypes.Role, user.AccountTypeID.ToString()),
                }),
                Expires = expirationTime,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSECRET)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
            var expected = new AuthData
            {
                AccessToken = token,
                TokenExpirationTime = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds(),
                Id = user.UserID.ToString(),
                Role = user.AccountTypeID,
                Name = user.Name,
                Email = user.Email,
                Warehouses = user.Warehouses.Select(x => new MinimalWarehouse { Id = x.WarehouseID, Name = x.Name }).ToList(),
            };

            // Setup
            systemClockMock.Setup(s => s.GetCurrentUtcTime()).Returns(currentTime);

            // Execute and Assert
            var response = authService.GetAuthData(user);

            systemClockMock.Verify(s => s.GetCurrentUtcTime(), Times.Once);

            // Assert.AreEqual(response, expected); // This thing doesnt work here
            Assert.IsTrue(response.Email == expected.Email
                && response.Id == expected.Id
                && response.Name == expected.Name
                && response.Role == expected.Role
                && response.Warehouses.First().Id == expected.Warehouses.First().Id
                && response.AccessToken == expected.AccessToken
                && response.TokenExpirationTime == expected.TokenExpirationTime);
        }

        [TestMethod]
        public void When_Verifying_Login_Then_It_Is_Works()
        {
            var password = "testPass123"; var credentialPassword = "testPass123";
            var salt = PasswordHelper.GenSalt();
            var userBuilder = new UserBuilder();
            var currentTime = DateTime.UtcNow;
            var user = userBuilder.WithId(Guid.NewGuid())
                .WithAccountType(AccountTypeEnum.ADMIN)
                .WithWarehouses(new List<Warehouse> { new Warehouse { WarehouseID = 1 } })
                .WithPassword(Convert.ToBase64String(PasswordHelper.HashPassword(password, salt)))
                .WithSalt(Convert.ToBase64String(salt))
                .Build();

            systemClockMock.Setup(s => s.GetCurrentUtcTime()).Returns(currentTime);

            var response = authService.VerifyLogin(user, credentialPassword);

            systemClockMock.Verify(s => s.GetCurrentUtcTime(), Times.Once);

            Assert.IsTrue(response.StatusCode == HttpStatusCode.OK);
        }

        [TestMethod]
        public void When_Verifying_Login_With_Wrong_Pw_Then_Error()
        {
            var password = "testPass123"; var credentialPassword = "wrongPass123";
            var salt = PasswordHelper.GenSalt();
            var userBuilder = new UserBuilder();
            var currentTime = DateTime.UtcNow;
            var user = userBuilder.WithId(Guid.NewGuid())
                .WithPassword(Convert.ToBase64String(PasswordHelper.HashPassword(password, salt)))
                .WithSalt(Convert.ToBase64String(salt))
                .Build();

            systemClockMock.Setup(s => s.GetCurrentUtcTime()).Returns(currentTime);

            var response = authService.VerifyLogin(user, credentialPassword);
            Assert.IsTrue(response.StatusCode == HttpStatusCode.NotFound);
        }
    }
}