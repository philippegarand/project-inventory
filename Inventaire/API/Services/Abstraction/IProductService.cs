using API.Entities.Views;
using API.Services.Entities;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services.Abstraction
{
    public interface IProductService : IBaseService<Product, Guid>
    {
        public ServiceResponse<IEnumerable<ProductNamesView>> GetProductNames();
    }
}