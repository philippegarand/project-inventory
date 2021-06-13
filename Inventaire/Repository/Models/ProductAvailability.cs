using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class ProductAvailability
    {
        [Required]
        public Guid ProductID { get; set; }

        [Required]
        public int WarehouseID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("ProductID")]
        public Product Product { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse Warehouse { get; set; }
    }
}