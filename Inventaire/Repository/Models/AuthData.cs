using System.Collections.Generic;

namespace Repository.Models
{
    public class MinimalWarehouse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class AuthData
    {
        public string AccessToken { get; set; }
        public long TokenExpirationTime { get; set; }
        public string Id { get; set; }
        public int Role { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public IEnumerable<MinimalWarehouse> Warehouses { get; set; }
    }
}