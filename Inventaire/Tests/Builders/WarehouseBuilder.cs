using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;

namespace Tests.Builders
{
    public class WarehouseBuilder
    {
        private readonly Warehouse warehouse = new Warehouse();

        public WarehouseBuilder WithId(int id)
        {
            warehouse.WarehouseID = id;
            return this;
        }

        public WarehouseBuilder WithName(string name)
        {
            warehouse.Name = name;
            return this;
        }

        public WarehouseBuilder WithCountry(string country)
        {
            warehouse.Country = country;
            return this;
        }

        public WarehouseBuilder WithPostalCode(string postalCode)
        {
            warehouse.PostalCode = postalCode;
            return this;
        }

        public WarehouseBuilder WithAddress(string address)
        {
            warehouse.Address = address;
            return this;
        }

        public Warehouse Build()
        {
            return warehouse;
        }
    }
}
