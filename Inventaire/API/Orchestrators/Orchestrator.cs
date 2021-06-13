using API.Entities.DTOs;
using API.Entities.Views;
using API.Hubs;
using API.Hubs.Clients;
using API.Services.Abstraction;
using API.Services.Entities;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Repository.Models;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Orchestrators
{
    public class Orchestrator
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IProductService _productService;
        private readonly IBaseService<Warehouse, int> _warehouseService;
        private readonly IHistoryService _historyService;
        private readonly IProductAvailabilityService _productAvailabilityService;
        private readonly IBaseService<Category, int> _categoryService;

        private readonly IHubContext<HistoryHub, IHistoryClient> _historyHub;
        private readonly IHubContext<ProductAvailabilityHub, IProductAvailabilityClient> _paHub;

        public Orchestrator(

            IAuthService authService,
            IUserService userService,
            IProductService productService,
            IBaseService<Warehouse, int> warehouseService,
            IHistoryService historyService,
            IProductAvailabilityService productAvailabilityService,
            IBaseService<Category, int> categoryService,
            IHubContext<HistoryHub, IHistoryClient> historyHub,
            IHubContext<ProductAvailabilityHub, IProductAvailabilityClient> paHub
            )
        {
            _authService = authService;
            _userService = userService;
            _productService = productService;
            _warehouseService = warehouseService;
            _historyService = historyService;
            _productAvailabilityService = productAvailabilityService;
            _categoryService = categoryService;
            _historyHub = historyHub;
            _paHub = paHub;
        }

        public ServiceResponse<AuthData> Login(LoginDTO credentials)
        {
            var user = _userService.GetByEmail(credentials.Email);

            if (user == null)
                return new ServiceResponse<AuthData>(HttpStatusCode.NotFound, "No user with this email");

            return _authService.VerifyLogin(user, credentials.Password);
        }

        public async Task<ServiceResponse<User>> Register(RegisterDTO newUser)
        {
            return await _userService.Add(new User
            {
                UserID = Guid.NewGuid(),
                AccountTypeID = (int)AccountTypeEnum.NONE,
                Email = newUser.Email,
                Name = newUser.Name,
                Password = newUser.Password,
            });
        }

        public async Task<ServiceResponse<User>> AddEmployee(AddEmployeeDTO dto)
        {
            return await _userService.Add(new User
            {
                UserID = Guid.NewGuid(),
                AccountTypeID = dto.AccountTypeID,
                Email = dto.Email,
                Name = dto.Name,
                Password = dto.Password,
                Warehouses = await GetWarehousesByIds(dto.WarehouseIDs)
            });
        }

        public async Task<ServiceResponse<User>> ModifyEmployee(ModifyEmployeeDTO dto)
        {
            var currentUser = (await _userService.GetById(dto.UserID)).Data;

            if (currentUser != default)
            {
                currentUser.Name = dto.Name;
                currentUser.AccountTypeID = dto.AccountTypeID;
                currentUser.Warehouses = await GetWarehousesByIds(dto.WarehouseIDs);

                return await _userService.Update(currentUser);
            }
            else
                return new ServiceResponse<User>(HttpStatusCode.NotFound, "Employee not found");
        }

        private async Task<List<Warehouse>> GetWarehousesByIds(int[] WarehouseIDs)
        {
            var warehouseTasks = WarehouseIDs.Select(async whid => (await _warehouseService.GetById(whid)).Data);
            var warehouses = new List<Warehouse>();

            foreach (var item in warehouseTasks)
            {
                warehouses.Add(await item);
            }

            return warehouses;
        }

        public async Task<ServiceResponse<AuthData>> UpdateSessionUser(Guid userId)
        {
            var userRes = await _userService.GetById(userId);

            if (userRes.Data == null)
                return new ServiceResponse<AuthData>(HttpStatusCode.NotFound, "User not found");

            var authData = _authService.GetAuthData(userRes.Data);

            return new ServiceResponse<AuthData>(HttpStatusCode.OK, authData);
        }

        public async Task<ServiceResponse<ProductAvailability>> AddProductAvailability(ProductAvailability pa)
        {
            var product = await _productService.GetById(pa.ProductID);
            var warehouse = await _warehouseService.GetById(pa.WarehouseID);

            if (product.Data == default || warehouse.Data == default)
            {
                return new ServiceResponse<ProductAvailability>(HttpStatusCode.Conflict, "Product or warehouse doesn't exist");
            }
            var res = await _productAvailabilityService.Add(pa);
            await UpdatePA(pa);
            return res;
        }

        public async Task<ServiceResponse<ProductAvailability>> UpdateQuantity(ProductAvailability pa)
        {
            if (pa.Quantity < 0)
            {
                return new ServiceResponse<ProductAvailability>(HttpStatusCode.BadRequest,
                    "Quantity can't be negative");
            }

            var res = await _productAvailabilityService.Update(pa);
            await UpdatePA(pa);
            return res;
        }

        public async Task<ServiceResponse<ProductAvailability>> AddOrUpdateProductAvailability(ProductAvailability pa, string userId)
        {
            var product = await _productService.GetById(pa.ProductID);
            var warehouse = await _warehouseService.GetById(pa.WarehouseID);

            if (product.Data == default || warehouse.Data == default)
                return new ServiceResponse<ProductAvailability>(HttpStatusCode.Conflict, "Product or warehouse doesn't exist");

            var existingPa = _productAvailabilityService.GetByWarehouseAndProduct(pa.WarehouseID, pa.ProductID).Data;

            // not in this warehouse yet, add this pas
            if (existingPa == default)
            {
                if (pa.Quantity >= 0)
                {
                    var addRes = await _productAvailabilityService.Add(pa);
                    if (addRes.StatusCode == HttpStatusCode.Created)
                    {
                        await AddHistoryLog(ActionEnum.ADD, pa.ProductID, pa.WarehouseID, userId, pa.Quantity);
                        await UpdatePA(pa);
                    }
                    return addRes;
                }
                else
                {
                    return new ServiceResponse<ProductAvailability>(HttpStatusCode.BadRequest, "Can't add negative quantity");
                }
            }

            // Edit quantity of existing pa
            existingPa.Quantity += pa.Quantity;

            if (existingPa.Quantity >= 0)
            {
                var updateRes = await _productAvailabilityService.Update(existingPa);

                if (updateRes.StatusCode == HttpStatusCode.Accepted)
                {
                    await AddHistoryLog(pa.Quantity > 0 ? ActionEnum.ADD : ActionEnum.REMOVE, existingPa.ProductID, existingPa.WarehouseID, userId, pa.Quantity);
                    await UpdatePA(existingPa);
                }

                return updateRes;
            }
            else
            {
                return new ServiceResponse<ProductAvailability>(HttpStatusCode.BadRequest, "Quantity after update can't be negative");
            }
        }

        public async Task<ServiceResponse<Product>> AddProduct(Product product)
        {
            var category = await _categoryService.GetById(product.CategoryID);

            if (category.Data == default)
            {
                return new ServiceResponse<Product>(HttpStatusCode.NotFound, "Category not found");
            }

            return await _productService.Add(product);
        }

        public async Task<ServiceResponse<Product>> UpdateProduct(Product product)
        {
            var category = await _categoryService.GetById(product.CategoryID);

            if (category.Data == default)
            {
                return new ServiceResponse<Product>(HttpStatusCode.NotFound, "Category not found");
            }

            if (product.Weight < 0)
            {
                return new ServiceResponse<Product>(HttpStatusCode.BadRequest, "Weight cannot be negative");
            }

            return await _productService.Update(product);
        }

        private async Task AddHistoryLog(ActionEnum action, Guid productId, int warehouseId, string userId, int quantity)
        {
            var log = new History
            {
                ActionID = (int)action,
                ProductID = productId,
                WarehouseID = warehouseId,
                UserID = new Guid(userId),
                Quantity = quantity
            };

            await _historyService.Add(log);

            // Send new log to all connected clients
            await _historyHub.Clients.All.ReceiveLog(new HistoryView
            {
                ID = log.HistoryID,
                ActionID = log.ActionID,
                Action = log.Action.Name,
                ProductID = log.ProductID,
                Product = log.Product.Name,
                WarehouseID = log.WarehouseID,
                Warehouse = log.Warehouse.Name,
                UserID = log.UserID,
                User = log.User.Name,
                Quantity = log.Quantity,
                Date = log.Date,
            });
        }

        private async Task UpdatePA(ProductAvailability pa)
        {
            // fix to not have JSON loop
            if (pa.Warehouse != null) pa.Warehouse.Users = new List<User>();
            await _paHub.Clients.All.ReceivePAUpdate(pa);
        }
    }
}