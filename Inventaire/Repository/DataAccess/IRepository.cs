using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Repository.DataAccess
{
    public interface IRepository<T, K>
    {
        Task Add(T obj);
        bool Any(T obj);
        Task Remove(T obj);
        Task Update(T obj);
        /// <summary>
        /// Get
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Either the obj or null if not found</returns>
        Task<T> GetById(K id);
        IQueryable<T> Get();
        IEnumerable<T> GetWhere(Expression<Func<T, bool>> predicate);
    }
}
