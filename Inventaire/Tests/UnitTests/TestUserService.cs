using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using API.Services;
using Moq;
using Repository.DataAccess;
using Repository.Models;
using Tests.Builders;
using API.Entities.DTOs;
using API.Helpers;

namespace Tests.UnitTests
{
    [TestClass]
    public class TestUserService
    {
        private UserService userService;

        private Mock<IRepository<User, Guid>> userRepoMock;

        [TestInitialize]
        public void TestInitialize()
        {
            userRepoMock = new Mock<IRepository<User, Guid>>();
            userService = new UserService(userRepoMock.Object);
        }

        [TestMethod]
        public void When_Updating_Email_Then_It_Is_Updated()
        {
            var newEmail = "test@test.com";
            var id = Guid.NewGuid();
            var userBuilder = new UserBuilder();
            var user = userBuilder.WithId(id).WithEmail("oldEmail@test.com").Build();
            var users = Array.Empty<User>();

            userRepoMock.Setup(x => x.GetById(id))
                .ReturnsAsync(user);
            userRepoMock.Setup(x => x.GetWhere(u => u.Email == newEmail))
                        .Returns(users);

            var response = userService.UpdateEmail(newEmail, user.UserID);

            Assert.IsTrue(response.Result.StatusCode == HttpStatusCode.Accepted);
            userRepoMock.Verify(ur => ur.Update(user), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Email_With_Already_Used_Email_Then_Error()
        {
            var newEmail = "test@test.com";
            var id = Guid.NewGuid();
            var userBuilder = new UserBuilder();
            var user = userBuilder.WithId(id).Build();
            var users = new List<User> { userBuilder.WithId(Guid.NewGuid()).WithEmail(newEmail).Build() };

            userRepoMock.Setup(x => x.GetWhere(u => u.Email == newEmail))
                        .Returns(users);

            var response = userService.UpdateEmail(newEmail, user.UserID);
            Assert.IsTrue(response.Result.StatusCode == HttpStatusCode.Conflict);
            userRepoMock.Verify(ur => ur.Update(user), Times.Never);
        }

        [TestMethod]
        public void When_Get_By_Email_Then_It_Works()
        {
            var email = "test@test.com";
            var id = Guid.NewGuid();
            var userBuilder = new UserBuilder();
            var expectedUser = userBuilder.WithId(id).WithEmail(email).Build();
            var users = new List<User> { expectedUser };

            userRepoMock.Setup(x => x.GetWhere(u => u.Email == email))
                .Returns(users);

            var response = userService.GetByEmail(email);
            Assert.AreEqual(response, expectedUser);
        }

        [TestMethod]
        public void When_Updating_Password_Then_It_Is_Updated()
        {
            var id = Guid.NewGuid();
            var oldPassword = "oldPass123"; var newPassword = "newPass123";
            var password = new ChangePasswordDTO { newPassword = newPassword, oldPassword = oldPassword };
            var salt = PasswordHelper.GenSalt();
            var userBuilder = new UserBuilder();
            var user = userBuilder.WithId(id)
                .WithPassword(Convert.ToBase64String(PasswordHelper.HashPassword(oldPassword, salt)))
                .WithSalt(Convert.ToBase64String(salt))
                .Build();
            var users = new List<User> { user };

            userRepoMock.Setup(s => s.GetById(id))
                .ReturnsAsync(user);

            var response = userService.UpdatePassword(password, id);
            Assert.IsTrue(response.Result.StatusCode == HttpStatusCode.Accepted);
            userRepoMock.Verify(Uri => Uri.Update(user), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Password_With_Wrong_Old_Pw_Then_Error()
        {
            var id = Guid.NewGuid();
            var oldPassword = "oldPass123"; var newPassword = "newPass123"; var wrongPassword = "wrongPass123";
            var password = new ChangePasswordDTO { newPassword = newPassword, oldPassword = wrongPassword };
            var salt = PasswordHelper.GenSalt();
            var userBuilder = new UserBuilder();
            var user = userBuilder.WithId(id)
                .WithPassword(Convert.ToBase64String(PasswordHelper.HashPassword(oldPassword, salt)))
                .WithSalt(Convert.ToBase64String(salt))
                .Build();
            var users = new List<User> { user };

            userRepoMock.Setup(s => s.GetById(id))
                .ReturnsAsync(user);

            var response = userService.UpdatePassword(password, id);
            Assert.IsTrue(response.Result.StatusCode == HttpStatusCode.Conflict);
            userRepoMock.Verify(Uri => Uri.Update(user), Times.Never);
        }
    }
}