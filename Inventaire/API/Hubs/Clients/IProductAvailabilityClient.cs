using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.Views;
using Repository.Models;

namespace API.Hubs.Clients
{
    public interface IProductAvailabilityClient
    {
        Task ReceivePAUpdate(ProductAvailability pa);
    }
}