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
    public class CategoryRepository: BaseRepository<Category, int>
    {
        public CategoryRepository(InventoryContext context) :base(context)
        {
        }

        public override async Task<Category> GetById(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public override IQueryable<Category> Get()
        {
           return _context.Categories.AsQueryable();
        }

        public override IEnumerable<Category> GetWhere(Expression<Func<Category, bool>> predicate)
        {
            return _context.Categories.Where(predicate);
        }
    }
}
