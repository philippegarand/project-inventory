using API.Entities.Views;
using API.Services.Entities;
using Repository.Models;
using System;
using System.Collections.Generic;

namespace API.Services.Abstraction
{
    public interface IHistoryService : IBaseService<History, Guid>
    {
        public ServiceResponse<IEnumerable<HistoryView>> GetLogs();
    }
}