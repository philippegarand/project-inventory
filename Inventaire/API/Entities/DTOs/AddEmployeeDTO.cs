using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.DTOs
{
    public class AddEmployeeDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int[] WarehouseIDs { get; set; }
        public int AccountTypeID { get; set; }
    }
}