using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Action = Repository.Models.Action;

namespace Repository.DataAccess
{
    public class ActionRepository: BaseRepository<Action, int>
    {
        public ActionRepository(InventoryContext context) :base(context)
        {
        }

        public override async Task<Action> GetById(int id)
        {
            return await _context.Actions.FindAsync(id);
        }

        public override IQueryable<Action> Get()
        {
           return _context.Actions.AsQueryable();
        }

        public override IEnumerable<Action> GetWhere(Expression<System.Func<Action, bool>> predicate)
        {
            return _context.Actions.Where(predicate);
        }
    }
}
