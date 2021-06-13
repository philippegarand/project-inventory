using API.Services.Abstraction;
using API.Services.Entities;
using Repository.DataAccess;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Services
{
    public class ProductAvailabilityService : BaseService<ProductAvailability, Guid>, IProductAvailabilityService
    {
        public ProductAvailabilityService(IRepository<ProductAvailability, Guid> repo) : base(repo)
        {
        }

        public ServiceResponse<IEnumerable<ProductAvailability>> GetInventory()
        {
            return base.Get();
        }

        public ServiceResponse<IEnumerable<ProductAvailability>> GetByWarehouse(int id)
        {
            return new ServiceResponse<IEnumerable<ProductAvailability>>(HttpStatusCode.OK, _repo.GetWhere(x => x.WarehouseID == id));
        }

        public ServiceResponse<ProductAvailability> GetByWarehouseAndProduct(int warehouseId, Guid productId)
        {
            return new ServiceResponse<ProductAvailability>(HttpStatusCode.OK, _repo.GetWhere(x => x.WarehouseID == warehouseId && x.ProductID == productId).SingleOrDefault());
        }

        public async Task<ServiceResponse<ProductAvailability>> UpdateQuantity(ProductAvailability pa)
        {
            if (pa.Quantity < 0)
            {
                return new ServiceResponse<ProductAvailability>(HttpStatusCode.BadRequest,
                    "Quantity can't be negative");
            }

            await _repo.Update(pa);

            return new ServiceResponse<ProductAvailability>(HttpStatusCode.OK);
        }
    }
}