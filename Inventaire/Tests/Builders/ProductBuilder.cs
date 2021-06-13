using System;
using Repository.Models;

namespace Tests.Builders
{
    public class ProductBuilder
    {
        private readonly Product product = new Product();

        public ProductBuilder WithId(Guid productId)
        {
            product.ProductID = productId;
            return this;
        }

        public ProductBuilder WithCategoryId(int id)
        {
            product.CategoryID = id;
            return this;
        }

        public ProductBuilder WithCategory(Category category)
        {
            product.Category = category;
            return this;
        }

        public ProductBuilder WithName(string name)
        {
            product.Name = name;
            return this;
        }

        public ProductBuilder WithDescription(string description)
        {
            product.Description = description;
            return this;
        }

        public ProductBuilder WithWeight(float weight)
        {
            product.Weight = weight;
            return this;
        }

        public Product Build()
        {
            return product;
        }
    }
}