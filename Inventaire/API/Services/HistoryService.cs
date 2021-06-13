using API.Entities.Views;
using API.Services.Abstraction;
using API.Services.Entities;
using Repository.DataAccess;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace API.Services
{
    public class HistoryService : BaseService<History, Guid>, IHistoryService
    {
        public HistoryService(IRepository<History, Guid> repo) : base(repo)
        {
        }

        public ServiceResponse<IEnumerable<HistoryView>> GetLogs()
        {
            return new ServiceResponse<IEnumerable<HistoryView>>(
                HttpStatusCode.OK,
                _repo.Get()
                    .Take(700)
                    .OrderByDescending(l => l.Date)
                    .Select(x => new HistoryView
                    {
                        ID = x.HistoryID,
                        ActionID = x.ActionID,
                        Action = x.Action.Name,
                        ProductID = x.ProductID,
                        Product = x.Product.Name,
                        WarehouseID = x.WarehouseID,
                        Warehouse = x.Warehouse.Name,
                        UserID = x.UserID,
                        User = x.User.Name,
                        Quantity = x.Quantity,
                        Date = x.Date,
                    }),
                "up to 700 rows fetched"
               );
        }
    }
}