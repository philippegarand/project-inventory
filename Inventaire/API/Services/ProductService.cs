using API.Services.Abstraction;
using System;
using Repository.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services.Entities;
using API.Entities.Views;
using Repository.DataAccess;
using System.Net;

namespace API.Services
{
    public class ProductService : BaseService<Product, Guid>, IProductService
    {
        public ProductService(IRepository<Product, Guid> repo) : base(repo)
        {
        }

        public ServiceResponse<IEnumerable<ProductNamesView>> GetProductNames()
        {
            return new ServiceResponse<IEnumerable<ProductNamesView>>(HttpStatusCode.OK, _repo.Get().Select(p => new ProductNamesView
            {
                ProductID = p.ProductID,
                Name = p.Name,
            }).ToList());
        }
    }
}