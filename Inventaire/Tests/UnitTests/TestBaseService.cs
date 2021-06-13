using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using API.Services;
using Moq;
using Repository.DataAccess;
using Repository.Models;
using Tests.Builders;
using API.Services.Abstraction;
using System.Net;

namespace Tests.UnitTests
{
    [TestClass]
    public class TestBaseService
    {
        private BaseService<User, Guid> baseUserService;

        private Mock<IRepository<User, Guid>> repoUserMock;

        [TestInitialize]
        public void TestInitialize()
        {
            repoUserMock = new Mock<IRepository<User, Guid>>();
            baseUserService = new BaseService<User, Guid>(repoUserMock.Object);
        }

        [TestMethod]
        public void When_Testing_Add_Then_It_Is_Added()
        {
            // Can be used to test with differents types of objects
            var user = new UserBuilder().WithId(Guid.NewGuid()).Build();
            When_Adding_T_Then_It_Is_Added_Async(user, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Add_Then_It_Is_Updated()
        {
            // Can be used to test with differents types of objects
            var user = new UserBuilder().WithId(Guid.NewGuid()).Build();

            When_Adding_Existing_T_Then_It_Is_Updated_Async(user, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Get_Then_It_Works()
        {
            // Can be used to test with differents types of objects
            var user = new UserBuilder().WithId(Guid.NewGuid()).Build();
            var users = new[] { user };

            When_Getting_All_T_Then_It_Works(users.AsQueryable(), baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Get_By_Id_Then_It_Works()
        {
            // Can be used to test with differents types of objects
            var id = Guid.NewGuid();
            var user = new UserBuilder().WithId(id).Build();

            When_Getting_T_By_Id_Then_It_Returns_T(user, id, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Remove_Then_It_Works()
        {
            // Can be used to test with differents types of objects
            var id = Guid.NewGuid();

            When_Removing_T_With_Invalid_Id_Then_It_Is_Not_Removed(id, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Remove_With_Invalid_Id_Then_It_Is_Not_Removed()
        {
            // Can be used to test with differents types of objects
            var id = Guid.NewGuid();
            var user = new UserBuilder().WithId(id).Build();

            When_Removing_T_By_Id_Then_It_Is_Removed(user, id, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Update_Then_It_Works()
        {
            // Can be used to test with differents types of objects
            var user = new UserBuilder().WithId(Guid.NewGuid()).Build();

            When_Updating_T_Then_It_Is_Updated(user, baseUserService, repoUserMock);
        }

        [TestMethod]
        public void When_Testing_Update_With_Null_Value_Then_It_Is_Not_Updated()
        {
            // Can be used to test with differents types of objects
            var user = new UserBuilder().WithId(Guid.NewGuid()).Build();

            When_Updating__With_Null_T_Then_It_Is_Not_Updated(baseUserService, repoUserMock);
        }

        private static async void When_Adding_T_Then_It_Is_Added_Async<T, K>(T objToAdd, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.Any(objToAdd)).Returns(false);

            var res = await baseService.Add(objToAdd);

            repoMock.Verify(r => r.Any(objToAdd), Times.Once);
            repoMock.Verify(r => r.Add(objToAdd), Times.Once);
            repoMock.Verify(r => r.Update(objToAdd), Times.Never);
            Assert.IsTrue(res.StatusCode == HttpStatusCode.Created);
        }

        private static async void When_Adding_Existing_T_Then_It_Is_Updated_Async<T, K>(T objToAdd, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.Any(objToAdd)).Returns(true);

            var res = await baseService.Add(objToAdd);

            repoMock.Verify(r => r.Any(objToAdd), Times.Once);
            repoMock.Verify(r => r.Add(objToAdd), Times.Never);
            repoMock.Verify(r => r.Update(objToAdd), Times.Once);
            Assert.IsTrue(res.StatusCode == HttpStatusCode.OK);
        }

        private static void When_Getting_All_T_Then_It_Works<T, K>(IQueryable<T> objsToGet, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.Get()).Returns(objsToGet);

            var res = baseService.Get();

            repoMock.Verify(r => r.Get(), Times.Once);
            Assert.AreEqual(res.Data, objsToGet);
            Assert.IsTrue(res.StatusCode == HttpStatusCode.OK);
        }

        private static void When_Getting_T_By_Id_Then_It_Returns_T<T, K>(T objToGet, K id, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.GetById(id)).ReturnsAsync(objToGet);

            var res = baseService.GetById(id);

            repoMock.Verify(r => r.GetById(id), Times.Once);
            Assert.AreEqual(res.Result.Data, objToGet);
            Assert.IsTrue(res.Result.StatusCode == HttpStatusCode.OK);
        }

        private static void When_Removing_T_By_Id_Then_It_Is_Removed<T, K>(T objToRemove, K id, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.GetById(id)).ReturnsAsync(objToRemove);

            var res = baseService.Remove(id);

            repoMock.Verify(r => r.GetById(id), Times.Once);
            repoMock.Verify(r => r.Remove(objToRemove), Times.Once);
            Assert.IsTrue(res.Result.StatusCode == HttpStatusCode.Accepted);
        }

        private static void When_Removing_T_With_Invalid_Id_Then_It_Is_Not_Removed<T, K>(K id, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            repoMock.Setup(r => r.GetById(id)).ReturnsAsync(null);

            var res = baseService.Remove(id);

            repoMock.Verify(r => r.GetById(id), Times.Once);
            repoMock.Verify(r => r.Remove(It.IsAny<T>()), Times.Never);
            Assert.IsTrue(res.Result.StatusCode == HttpStatusCode.NotFound);
        }

        private static void When_Updating_T_Then_It_Is_Updated<T, K>(T objToUpdate, IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            var res = baseService.Update(objToUpdate);

            repoMock.Verify(r => r.Update(objToUpdate), Times.Once);
            Assert.IsTrue(res.Result.StatusCode == HttpStatusCode.Accepted);
        }

        private static void When_Updating__With_Null_T_Then_It_Is_Not_Updated<T, K>(IBaseService<T, K> baseService, Mock<IRepository<T, K>> repoMock)
        {
            T obj = default;
            var res = baseService.Update(obj);

            repoMock.Verify(r => r.Update(It.IsAny<T>()), Times.Never);
            Assert.IsTrue(res.Result.StatusCode == HttpStatusCode.NotFound);
        }
    }
}