using API.Hubs;
using API.Hubs.Clients;
using API.Orchestrators;
using API.Services.Abstraction;
using API.Services.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Tests.Builders;

namespace Tests.UnitTests
{
    [TestClass]
    public class TestOrchestrator
    {
        private Orchestrator orchestrator;

        private Mock<IAuthService> authServiceMock;

        private Mock<IUserService> userServiceMock;

        private Mock<IProductService> productServiceMock;

        private Mock<IBaseService<Warehouse, int>> warehouseServiceMock;

        private Mock<IHistoryService> historyServiceMock;

        private Mock<IProductAvailabilityService> productAvailabilityServiceMock;

        private Mock<IBaseService<Category, int>> categoryServiceMock;

        private Mock<IHubContext<HistoryHub, IHistoryClient>> historyHubMock;

        private Mock<IHubContext<ProductAvailabilityHub, IProductAvailabilityClient>> paHubMock;

        private LoginDTOBuilder credentialsBuilder;

        private UserBuilder userBuilder;

        private RegisterDTOBuilder registerDTOBuilder;

        private AddEmployeeDTOBuilder addEmployeeDTOBuilder;

        private ModifyEmployeeDTOBuilder modifyEmployeeDTOBuilder;

        private ProductAvailabilityBuilder productAvailabilityBuilder;

        private WarehouseBuilder warehouseBuilder;

        private ProductBuilder productBuilder;

        [TestInitialize]
        public void TestInitialize()
        {
            authServiceMock = new Mock<IAuthService>();
            userServiceMock = new Mock<IUserService>();
            productServiceMock = new Mock<IProductService>();
            warehouseServiceMock = new Mock<IBaseService<Warehouse, int>>();
            historyServiceMock = new Mock<IHistoryService>();
            productAvailabilityServiceMock = new Mock<IProductAvailabilityService>();
            categoryServiceMock = new Mock<IBaseService<Category, int>>();
            historyHubMock = new Mock<IHubContext<HistoryHub, IHistoryClient>>();
            paHubMock = new Mock<IHubContext<ProductAvailabilityHub, IProductAvailabilityClient>>();

            orchestrator = new Orchestrator(
                authServiceMock.Object,
                userServiceMock.Object,
                productServiceMock.Object,
                warehouseServiceMock.Object,
                historyServiceMock.Object,
                productAvailabilityServiceMock.Object,
                categoryServiceMock.Object,
                historyHubMock.Object,
                paHubMock.Object
                );

            credentialsBuilder = new LoginDTOBuilder();
            userBuilder = new UserBuilder();
            registerDTOBuilder = new RegisterDTOBuilder();
            addEmployeeDTOBuilder = new AddEmployeeDTOBuilder();
            modifyEmployeeDTOBuilder = new ModifyEmployeeDTOBuilder();
            productAvailabilityBuilder = new ProductAvailabilityBuilder();
            warehouseBuilder = new WarehouseBuilder();
            productBuilder = new ProductBuilder();
        }

        [TestMethod]
        public void When_Loggin_In_Then_It_Is_Called()
        {
            string email = "Test@Test.com";
            string password = "admin";

            var credentials = credentialsBuilder.WithEmail(email).WithPassword(password).Build();

            var userBuilder = new UserBuilder();
            var user = userBuilder.Build();

            userServiceMock.Setup(x => x.GetByEmail(email)).Returns(user);

            orchestrator.Login(credentials);

            userServiceMock.Verify(x => x.GetByEmail(email), Times.Once);
            authServiceMock.Verify(x => x.VerifyLogin(user, password), Times.Once);
        }

        [TestMethod]
        public void When_Registering_Then_It_Is_Called()
        {
            string email = "Test@Test.com";
            string name = "Rolland";
            string password = "admin";

            var registerDTO = registerDTOBuilder.WithEmail(email).WithName(name).WithPassword(password).Build();

            orchestrator.Register(registerDTO).Wait();

            userServiceMock.Verify(x => x.Add(It.Is<User>(u => u.Email == email && u.Name == name && u.Password == password)), Times.Once);
        }

        [TestMethod]
        public void When_Adding_Employee_Then_It_Is_Added()
        {
            string email = "Test@Test.com";
            string name = "Rolland";
            string password = "admin";
            int accountTypeID = 0;
            int[] warehousesIDS = { 0, 1, 2 };

            var addEmployeeDTO = addEmployeeDTOBuilder
                .WithEmail(email)
                .WithName(name)
                .WithPassword(password)
                .WithAccountTypeID(accountTypeID)
                .WithWarehousesIDs(warehousesIDS)
                .Build();

            var warehouseResponse = new ServiceResponse<Warehouse>(HttpStatusCode.OK, new Warehouse());

            warehousesIDS.ToList().ForEach(id => warehouseServiceMock.Setup(x => x.GetById(id)).ReturnsAsync(warehouseResponse));

            orchestrator.AddEmployee(addEmployeeDTO).Wait();

            userServiceMock.Verify(x => x.Add(It.Is<User>(u => u.Email == email && u.Name == name && u.Password == password && u.AccountTypeID == accountTypeID)), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Employee_Then_It_Is_Updated()
        {
            var id = Guid.NewGuid();
            int accountTypeID = 0;
            int[] warehousesIDS = { 0, 1, 2 };

            string oldName = "Rolland";
            string name = "Rolling Rock";

            var oldUser = userBuilder
                .WithId(id)
                .WithName(oldName)
                .Build();

            var newUser = userBuilder
                .WithId(id)
                .WithName(name)
                .Build();

            var modifyEmployeeDTO = modifyEmployeeDTOBuilder
                .WithUserID(id)
                .WithName(name)
                .WithAccountTypeID(accountTypeID)
                .WithWarehousesIDs(warehousesIDS)
                .Build();

            var userResponse = new ServiceResponse<User>(HttpStatusCode.OK, oldUser);
            var warehouseResponse = new ServiceResponse<Warehouse>(HttpStatusCode.OK, new Warehouse());

            userServiceMock.Setup(x => x.GetById(id)).ReturnsAsync(userResponse);
            warehousesIDS.ToList().ForEach(id => warehouseServiceMock.Setup(x => x.GetById(id)).ReturnsAsync(warehouseResponse));

            orchestrator.ModifyEmployee(modifyEmployeeDTO).Wait();

            userServiceMock.Verify(x => x.Update(It.Is<User>(u => u.Name == name)), Times.Once);
        }

        [TestMethod]
        public void When_Updating_User_Session_Then_It_Is_Updated()
        {
            var id = Guid.NewGuid();

            var user = userBuilder
                .WithId(id)
                .Build();

            var userResponse = new ServiceResponse<User>(HttpStatusCode.OK, user);

            userServiceMock.Setup(x => x.GetById(id)).ReturnsAsync(userResponse);

            orchestrator.UpdateSessionUser(id).Wait();

            authServiceMock.Verify(x => x.GetAuthData(userResponse.Data), Times.Once);
        }

        [TestMethod]
        public void When_Adding_Product_Availability_Then_It_Is_Added()
        {
            var productId = Guid.NewGuid();
            var warehouseId = 1;

            var productAvailability = productAvailabilityBuilder
                .WithProductId(productId)
                .WithWarehouseId(warehouseId)
                .WithQuantity(20)
                .Build();

            var product = productBuilder
                .WithId(productId)
                .WithName("Chapeau")
                .WithWeight(2.0f)
                .WithDescription("Protege tete")
                .Build();

            var warehouse = warehouseBuilder
                .WithId(warehouseId)
                .WithName("Quebec")
                .WithAddress("Quelque part")
                .Build();

            var productResponse = new ServiceResponse<Product>(HttpStatusCode.OK, product);

            var warehouseResponse = new ServiceResponse<Warehouse>(HttpStatusCode.OK, warehouse);

            productServiceMock.Setup(x => x.GetById(productId)).ReturnsAsync(productResponse);
            warehouseServiceMock.Setup(x => x.GetById(warehouseId)).ReturnsAsync(warehouseResponse);
            paHubMock.Setup(x => x.Clients.All.ReceivePAUpdate(productAvailability)).Returns(Task.CompletedTask);

            orchestrator.AddProductAvailability(productAvailability).Wait();

            productAvailabilityServiceMock.Verify(x => x.Add(productAvailability), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Product_Quantity_Then_It_Is_Updated()
        {
            var productId = Guid.NewGuid();
            var warehouseId = 1;

            var productAvailability = productAvailabilityBuilder
                .WithProductId(productId)
                .WithWarehouseId(warehouseId)
                .WithQuantity(20)
                .Build();

            paHubMock.Setup(x => x.Clients.All.ReceivePAUpdate(productAvailability)).Returns(Task.CompletedTask);

            orchestrator.UpdateQuantity(productAvailability).Wait();

            productAvailabilityServiceMock.Verify(x => x.Update(productAvailability), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Product_Quantity_With_Negative_Quantity_Then_Bad_Request_Is_Returned()
        {
            var productId = Guid.NewGuid();
            var warehouseId = 1;

            var productAvailability = productAvailabilityBuilder
                .WithProductId(productId)
                .WithWarehouseId(warehouseId)
                .WithQuantity(-20)
                .Build();

            var expectedResponse = new ServiceResponse<ProductAvailability>(HttpStatusCode.BadRequest, "Quantity can't be negative");

            var res = orchestrator.UpdateQuantity(productAvailability).Result;

            Assert.AreEqual(res.Data, expectedResponse.Data);
            Assert.AreEqual(res.StatusCode, expectedResponse.StatusCode);
        }

        [TestMethod]
        public void When_Adding_Product_Then_It_Is_Added()
        {
            var productId = Guid.NewGuid();
            var categoryId = 2;

            var product = productBuilder
                .WithId(productId)
                .WithCategoryId(categoryId)
                .WithName("Marteau")
                .WithWeight(2.5f)
                .Build();

            var categoryResponse = new ServiceResponse<Category>(HttpStatusCode.OK, new Category());

            categoryServiceMock.Setup(x => x.GetById(product.CategoryID)).ReturnsAsync(categoryResponse);

            orchestrator.AddProduct(product).Wait();

            productServiceMock.Verify(x => x.Add(product), Times.Once);
        }

        [TestMethod]
        public void When_Adding_Product_With_Non_Existent_Category_Then_It_Is_Not_Found()
        {
            var productId = Guid.NewGuid();
            var categoryId = 2;

            var product = productBuilder
                .WithId(productId)
                .WithCategoryId(categoryId)
                .WithName("Marteau")
                .WithWeight(2.5f)
                .Build();

            var categoryResponse = new ServiceResponse<Category>(HttpStatusCode.OK, null);

            var expectedResponse = new ServiceResponse<Product>(HttpStatusCode.NotFound, "Category not found");

            categoryServiceMock.Setup(x => x.GetById(product.CategoryID)).ReturnsAsync(categoryResponse);

            var res = orchestrator.AddProduct(product).Result;

            Assert.AreEqual(res.Data, expectedResponse.Data);
            Assert.AreEqual(res.StatusCode, expectedResponse.StatusCode);
        }

        [TestMethod]
        public void When_Updating_Product_Then_It_Is_Updated()
        {
            var productId = Guid.NewGuid();
            var categoryId = 2;

            var product = productBuilder
                .WithId(productId)
                .WithCategoryId(categoryId)
                .WithName("Marteau")
                .WithWeight(2.5f)
                .Build();

            var categoryResponse = new ServiceResponse<Category>(HttpStatusCode.OK, new Category());

            categoryServiceMock.Setup(x => x.GetById(product.CategoryID)).ReturnsAsync(categoryResponse);

            orchestrator.UpdateProduct(product).Wait();

            productServiceMock.Verify(x => x.Update(product), Times.Once);
        }

        [TestMethod]
        public void When_Updating_Product_With_Negative_Weight_Then_Bad_Request_Is_Returned()
        {
            var productId = Guid.NewGuid();
            var categoryId = 2;

            var product = productBuilder
                .WithId(productId)
                .WithCategoryId(categoryId)
                .WithName("Marteau")
                .WithWeight(-2.5f)
                .Build();

            var categoryResponse = new ServiceResponse<Category>(HttpStatusCode.OK, new Category());

            var expectedResponse = new ServiceResponse<Product>(HttpStatusCode.BadRequest, "Weight cannot be negative");

            categoryServiceMock.Setup(x => x.GetById(product.CategoryID)).ReturnsAsync(categoryResponse);

            var res = orchestrator.UpdateProduct(product).Result;

            Assert.AreEqual(res.Data, expectedResponse.Data);
            Assert.AreEqual(res.StatusCode, expectedResponse.StatusCode);
        }

        [TestMethod]
        public void When_Updating_Product_With_Non_Existent_Category_Then_It_Is_Not_Found()
        {
            var productId = Guid.NewGuid();
            var categoryId = 2;

            var product = productBuilder
                .WithId(productId)
                .WithCategoryId(categoryId)
                .WithName("Marteau")
                .WithWeight(2.5f)
                .Build();

            var categoryResponse = new ServiceResponse<Category>(HttpStatusCode.OK, null);

            var expectedResponse = new ServiceResponse<Product>(HttpStatusCode.NotFound, "Category not found");

            categoryServiceMock.Setup(x => x.GetById(product.CategoryID)).ReturnsAsync(categoryResponse);

            var res = orchestrator.UpdateProduct(product).Result;

            Assert.AreEqual(res.Data, expectedResponse.Data);
            Assert.AreEqual(res.StatusCode, expectedResponse.StatusCode);
        }
    }
}