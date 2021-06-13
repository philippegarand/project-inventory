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
    public class AccountTypeRepository: BaseRepository<AccountType, int>
    {
        public AccountTypeRepository(InventoryContext context) :base(context)
        {
        }

        public override async Task<AccountType> GetById(int id)
        {
            return await _context.AccountTypes.FindAsync(id);
        }

        public override IQueryable<AccountType> Get()
        {
           return _context.AccountTypes.AsQueryable();
        }

        public override IEnumerable<AccountType> GetWhere(Expression<Func<AccountType, bool>> predicate)
        {
            return _context.AccountTypes.Where(predicate);
        }
    }
}
