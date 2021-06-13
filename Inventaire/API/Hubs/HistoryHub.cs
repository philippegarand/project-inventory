using API.Entities.Views;
using API.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class HistoryHub : Hub<IHistoryClient>
    {
    }
}