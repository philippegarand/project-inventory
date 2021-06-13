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
    public class HistoryRepository : BaseRepository<History, Guid>
    {
        public HistoryRepository(InventoryContext context) : base(context)
        {
        }

        public override async Task<History> GetById(Guid id)
        {
            return await _context.Histories
                .Include(h => h.Product)
                .Include(h => h.Product.Category)
                .Include(h => h.Warehouse)
                .Include(h => h.User)
                .Include(h => h.User.AccountType)
                .Include(h => h.Action)
                .SingleAsync(h => h.HistoryID == id);
        }

        public override IQueryable<History> Get()
        {
            // Ugly thing so we have user
            var hax = _context.Histories
                .Include(h => h.User)
                .Include(h => h.User.AccountType)
                .Include(h => h.Action)
                .Include(h => h.Product)
                .Include(h => h.Product.Category)
                .Include(h => h.Warehouse)
                .AsQueryable();
            var hax2 = hax.ToList();
            return hax;
        }

        public override IEnumerable<History> GetWhere(Expression<Func<History, bool>> predicate)
        {
            return _context.Histories
                .Include(h => h.Product)
                .Include(h => h.Product.Category)
                .Include(h => h.Warehouse)
                .Include(h => h.User)
                .Include(h => h.User.AccountType)
                .Include(h => h.Action)
                .Where(predicate);
        }
    }
}