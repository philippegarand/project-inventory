using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Repository.DataAccess
{
    public abstract class BaseRepository<T, KeyType>: IRepository<T, KeyType>
    {
        protected readonly InventoryContext _context;

        public BaseRepository(InventoryContext context)
        {
            _context = context;
        }

        public async Task Add(T obj)
        {
            await _context.AddAsync(obj);
            await _context.SaveChangesAsync();
        }

        public bool Any(T obj)
        {
            return Get().Any(o => o.Equals(obj));
        }

        public abstract Task<T> GetById(KeyType id);

        public abstract IQueryable<T> Get();

        public abstract IEnumerable<T> GetWhere(Expression<Func<T, bool>> predicate);

        public async Task Remove(T obj)
        {
            _context.Remove(obj);
            await _context.SaveChangesAsync();
        }

        public virtual async Task Update(T obj)
        {
            _context.Update(obj);
            await _context.SaveChangesAsync();
        }
    }
}
