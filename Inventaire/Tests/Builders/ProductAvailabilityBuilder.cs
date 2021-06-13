using System;
using Repository.Models;

namespace Tests.Builders
{
    public class ProductAvailabilityBuilder
    {
        private readonly ProductAvailability productAvailability = new ProductAvailability();

        public ProductAvailabilityBuilder WithProductId(Guid productId)
        {
            productAvailability.ProductID = productId;
            return this;
        }

        public ProductAvailabilityBuilder WithWarehouseId(int warehouseId)
        {
            productAvailability.WarehouseID = warehouseId;
            return this;
        }

        public ProductAvailabilityBuilder WithWareHouse(Warehouse warehouse)
        {
            productAvailability.Warehouse = warehouse;
            return this;
        }

        public ProductAvailabilityBuilder WithQuantity(int qty)
        {
            productAvailability.Quantity = qty;
            return this;
        }

        public ProductAvailabilityBuilder WithProduct(Product product)
        {
            productAvailability.Product = product;
            return this;
        }

        public ProductAvailability Build()
        {
            return productAvailability;
        }
    }
}
