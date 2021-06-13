using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Models
{
    public class User
    {
        public User()
        {
            Warehouses = new HashSet<Warehouse>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid UserID { get; set; }

        [Required]
        public int AccountTypeID { get; set; }

        [ForeignKey("AccountTypeID")]
        public AccountType AccountType { get; set; }

        [Required]
        [MaxLength(80)]
        public string Email { get; set; }

        [Required]
        [MaxLength(24)]
        public string Password { get; set; }

        [Required]
        [MaxLength(24)]
        public string Salt { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public ICollection<Warehouse> Warehouses { get; set; }
    }
}