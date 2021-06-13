using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestApp.Models
{
    public class ProductAvailability
    {
        public string productID { get; set; }
        public int warehouseID { get; set; }
        public int quantity { get; set; }
    }
}