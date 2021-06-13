using System;
using Repository.Models;

namespace Tests.Builders
{
    public class ProductRentedBuilder
    {
        private readonly ProductRented productRented = new ProductRented();

        public ProductRentedBuilder WithId(Guid productRentedId)
        {
            productRented.ProductRentedID= productRentedId;
            return this;
        }

        public ProductRentedBuilder WithProduct(Product product)
        {
            productRented.Product = product;
            return this;
        }

        public ProductRentedBuilder WithWareHouse(Warehouse warehouse)
        {
            productRented.Warehouse = warehouse;
            return this;
        }

        public ProductRentedBuilder WithQuantity(int qty)
        {
            productRented.Quantity = qty;
            return this;
        }

        public ProductRentedBuilder WithStartDate(DateTime time)
        {
            productRented.StartDate = time;
            return this;
        }

        public ProductRentedBuilder WithEndDate(DateTime time)
        {
            productRented.EndDate = time;
            return this;
        }

        public ProductRentedBuilder WithRenterName(string renterName)
        {
            productRented.RenterName = renterName;
            return this;
        }

        public ProductRentedBuilder WithRenterEmail(string renterEmail)
        {
            productRented.RenterEmail = renterEmail;
            return this;
        }

        public ProductRentedBuilder WithRenterPhone(string renterPhone)
        {
            productRented.RenterPhone = renterPhone;
            return this;
        }

        public ProductRented Build()
        {
            return productRented;
        }
    }
}
