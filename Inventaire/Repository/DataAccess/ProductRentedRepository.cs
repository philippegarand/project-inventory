using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Repository.DataAccess
{
    public class ProductRentedRepository : BaseRepository<ProductRented, Guid>
    {
        public ProductRentedRepository(InventoryContext context) : base(context)
        {
        }

        public override async Task<ProductRented> GetById(Guid id)
        {
            return await _context.ProductsRented
                .Include(pr => pr.Product)
                .Include(pr => pr.Product.Category)
                .Include(pr => pr.Warehouse)
                .SingleAsync(pr => pr.ProductRentedID == id);
        }

        public override IQueryable<ProductRented> Get()
        {
            return _context.ProductsRented
                 .Include(pr => pr.Product)
                 .Include(pr => pr.Product.Category)
                 .Include(pr => pr.Warehouse)
                 .AsQueryable();
        }

        public override IEnumerable<ProductRented> GetWhere(Expression<Func<ProductRented, bool>> predicate)
        {
            return _context.ProductsRented
                .Include(pr => pr.Product)
                .Include(pr => pr.Product.Category)
                .Include(pr => pr.Warehouse)
                .Where(predicate);
        }
    }
}