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
    public class ProductRepository: BaseRepository<Product, Guid>
    {
        public ProductRepository(InventoryContext context) :base(context)
        {
        }

        public override async Task<Product> GetById(Guid id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .SingleOrDefaultAsync(p => p.ProductID == id);
        }

        public override IQueryable<Product> Get()
        {
           return _context.Products
                .Include(p => p.Category)
                .AsQueryable();
        }

        public override IEnumerable<Product> GetWhere(Expression<Func<Product, bool>> predicate)
        {
            return _context.Products
                .Include(p => p.Category)
                .Where(predicate);
        }
    }
}
