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
    public class UserRepository : BaseRepository<User, Guid>
    {
        public UserRepository(InventoryContext context) : base(context)
        {
        }

        public override async Task<User> GetById(Guid id)
        {
            return await _context.Users
                .Include(u => u.AccountType)
                .Include(u => u.Warehouses)
                .SingleAsync(u => u.UserID == id);
        }

        public override IQueryable<User> Get()
        {
            return _context.Users
                .Include(u => u.AccountType)
                .Include(u => u.Warehouses)
                .AsQueryable();
        }

        public override async Task Update(User obj)
        {
            _context.Users.Update(obj);
            await _context.SaveChangesAsync();
        }

        public override IEnumerable<User> GetWhere(Expression<Func<User, bool>> predicate)
        {
            return _context.Users
                .Include(u => u.AccountType)
                .Include(u => u.Warehouses)
                .Where(predicate);
        }
    }
}