using API.Services.Entities;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services.Abstraction
{
    public interface IProductAvailabilityService : IBaseService<ProductAvailability, Guid>
    {
        public ServiceResponse<IEnumerable<ProductAvailability>> GetInventory();

        public ServiceResponse<IEnumerable<ProductAvailability>> GetByWarehouse(int warehouseId);

        public ServiceResponse<ProductAvailability> GetByWarehouseAndProduct(int warehouseId, Guid productId);

        public Task<ServiceResponse<ProductAvailability>> UpdateQuantity(ProductAvailability pa);
    }
}