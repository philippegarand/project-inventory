using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.DTOs
{
    public class ModifyEmployeeDTO
    {
        public Guid UserID { get; set; }
        public string Name { get; set; }
        public int[] WarehouseIDs { get; set; }
        public int AccountTypeID { get; set; }
    }
}