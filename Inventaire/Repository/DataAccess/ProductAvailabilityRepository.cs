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
    public class ProductAvailabilityRepository : BaseRepository<ProductAvailability, Guid>
    {
        public ProductAvailabilityRepository(InventoryContext context) : base(context)
        {
        }

        public override async Task<ProductAvailability> GetById(Guid id)
        {
            return await _context.ProductsAvailability
                .Include(pa => pa.Product)
                .Include(pa => pa.Warehouse)
                .Include(pa => pa.Product.Category)
                .SingleOrDefaultAsync(Parallel => Parallel.ProductID == id);
        }

        public override IQueryable<ProductAvailability> Get()
        {
            return _context.ProductsAvailability
                .Include(pa => pa.Product)
                .Include(pa => pa.Warehouse)
                .Include(pa => pa.Product.Category)
                .AsQueryable();
        }

        public override IEnumerable<ProductAvailability> GetWhere(Expression<Func<ProductAvailability, bool>> predicate)
        {
            return _context.ProductsAvailability
                .Include(pa => pa.Product)
                .Include(pa => pa.Warehouse)
                .Include(pa => pa.Product.Category)
                .Where(predicate);
        }
    }
}