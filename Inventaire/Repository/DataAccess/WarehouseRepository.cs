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
    public class WarehouseRepository : BaseRepository<Warehouse, int>
    {
        public WarehouseRepository(InventoryContext context) : base(context)
        {
        }

        // TODO: Careful to not return Users (how to proceed)

        public override async Task<Warehouse> GetById(int id)
        {
            return await _context.Warehouses.Include(wh => wh.Users).SingleAsync(wh => wh.WarehouseID == id);
        }

        public override IQueryable<Warehouse> Get()
        {
            return _context.Warehouses.Include(wh => wh.Users).AsQueryable();
        }

        public override IEnumerable<Warehouse> GetWhere(Expression<Func<Warehouse, bool>> predicate)
        {
            return _context.Warehouses.Include(wh => wh.Users).Where(predicate);
        }
    }
}