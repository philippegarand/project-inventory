using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.Views;

namespace API.Hubs.Clients
{
    public interface IHistoryClient
    {
        Task ReceiveLog(HistoryView historyLog);
    }
}