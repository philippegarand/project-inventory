using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class ProductRented
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid ProductRentedID { get; set; }

        [Required]
        public Guid ProductID { get; set; }

        [ForeignKey("ProductID")]
        public Product Product { get; set; }

        [Required]
        public int WarehouseID { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse Warehouse { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime EndDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string RenterName { get; set; }

        [Required]
        [MaxLength(80)]
        public string RenterEmail { get; set; }

        [Required]
        [MaxLength(40)]
        public string RenterPhone { get; set; }
    }
}