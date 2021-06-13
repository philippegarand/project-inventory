using API.Entities.DTOs;
using FizzWare.NBuilder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.DataAccess;
using Repository.Models;
using Repository.Models.Enums;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    [AuthorizeRoles(AccountTypeEnum.ADMIN)]
    [Route("api/[controller]")]
    [ApiController]
    public class MockDataController : ControllerBase
    {
        private readonly InventoryContext _dbContext;

        public MockDataController(InventoryContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public ActionResult Populate([FromBody] PopulateDbSettingsDTO settings)
        {
            try
            {
                if (settings.NbCategories > 0)
                {
                    var categories = Builder<Category>.CreateListOfSize(settings.NbCategories)
                    .All()
                        .With(c => c.CategoryID = 0)
                        .With(c => c.Name = new CultureInfo("en-US").TextInfo.ToTitleCase(Faker.Lorem.Words(1).First() + $" {Faker.Name.First()}"))
                    .Build();

                    _dbContext.Categories.AddRange(categories.ToArray());
                    _dbContext.SaveChanges();
                }

                if (settings.NbWarehouses > 0)
                {
                    var warehouses = Builder<Warehouse>.CreateListOfSize(settings.NbWarehouses)
                    .All()
                        .With(w => w.WarehouseID = 0)
                        .With(w => w.Name = Regex.Replace(Faker.Company.Name().Split()[0], @"[^0-9a-zA-Z\ ]+", ""))
                        .With(w => w.Country = Faker.Address.Country())
                        .With(w => w.PostalCode = Faker.Address.ZipCode())
                        .With(w => w.Address = Faker.Address.StreetAddress())
                        .With(w => w.Users = new List<User> { _dbContext.Users.Find(new Guid("bad730d5-f540-4118-ac17-6ba319ddfcda")) })
                    .Build();

                    _dbContext.Warehouses.AddRange(warehouses.ToArray());
                    _dbContext.SaveChanges();
                }

                if (settings.NbProducts > 0)
                {
                    var products = Builder<Product>.CreateListOfSize(settings.NbProducts)
                    .All()
                        .With(p => p.ProductID = Guid.NewGuid())
                        .With(p => p.CategoryID = Pick<Category>.RandomItemFrom(_dbContext.Categories.ToList()).CategoryID)
                        .With(p => p.Name = new CultureInfo("en-US").TextInfo.ToTitleCase(Faker.Lorem.Words(1).First() + $" {Faker.Internet.UserName()}"))
                        .With(p => p.Description = Faker.Lorem.Sentence())
                        .With(p => p.Weight = Faker.RandomNumber.Next(1, 250))
                    .Build();

                    _dbContext.Products.AddRange(products.ToArray());
                    _dbContext.SaveChanges();
                }

                if (settings.NbProductAvailabilities > 0)
                {
                    var products = _dbContext.Products.ToList();
                    var warehouses = _dbContext.Warehouses.ToList();

                    var productAvailabilities = Builder<ProductAvailability>.CreateListOfSize(settings.NbProductAvailabilities)
                    .All()
                        .With(pa => pa.ProductID = Pick<Product>.RandomItemFrom(products).ProductID)
                        .With(pa => pa.WarehouseID = Pick<Warehouse>.RandomItemFrom(warehouses).WarehouseID)
                        .With(pa => pa.Quantity = Faker.RandomNumber.Next(1, 10000))
                    .Build();

                    // To not have duplicate entries to add
                    var duplicates = productAvailabilities.GroupBy(pa => new { pa.ProductID, pa.WarehouseID })
                        .Where(g => g.Count() > 1)
                        .Select(g => g.Key).ToList();

                    while (duplicates.Count > 0)
                    {
                        int i = 0;
                        foreach (var item in duplicates)
                        {
                            if (i % 2 == 0)
                                productAvailabilities[productAvailabilities.IndexOf(productAvailabilities.First(pa => pa.ProductID == item.ProductID && pa.WarehouseID == item.WarehouseID))]
                                    .ProductID = Pick<Product>.RandomItemFrom(products).ProductID;
                            if (i % 2 != 0)
                                productAvailabilities[productAvailabilities.IndexOf(productAvailabilities.First(pa => pa.ProductID == item.ProductID && pa.WarehouseID == item.WarehouseID))]
                                    .WarehouseID = Pick<Warehouse>.RandomItemFrom(warehouses).WarehouseID;
                            i++;
                        }

                        duplicates = productAvailabilities.GroupBy(pa => new { pa.ProductID, pa.WarehouseID })
                            .Where(g => g.Count() > 1)
                            .Select(g => g.Key).ToList();
                    }

                    // Removes already existing PA
                    for (int i = productAvailabilities.Count - 1; i >= 0; i--)
                    {
                        var item = productAvailabilities[i];
                        if (_dbContext.ProductsAvailability.Any(pa => pa.ProductID == item.ProductID && pa.WarehouseID == item.WarehouseID))
                            productAvailabilities.RemoveAt(i);
                    }

                    _dbContext.ProductsAvailability.AddRange(productAvailabilities.ToArray());
                    _dbContext.SaveChanges();
                }

                if (settings.NbHistories > 0)
                {
                    var productAvailabilities = _dbContext.ProductsAvailability.ToList();

                    var daysGenerator = new RandomGenerator();
                    var rnd = new Random();
                    var histories = Builder<History>.CreateListOfSize(settings.NbHistories)
                        .All()
                            .With(h => h.HistoryID = Guid.NewGuid())
                            .With(h => h.ActionID = Faker.RandomNumber.Next(1, 2))
                            .With(h => h.ProductID = Pick<ProductAvailability>.RandomItemFrom(productAvailabilities).ProductID)
                            .With(h => h.WarehouseID = productAvailabilities.Where(pa => pa.ProductID == h.ProductID).OrderBy(x => rnd.Next()).First().WarehouseID)
                            .With(h => h.UserID = new Guid("bad730d5-f540-4118-ac17-6ba319ddfcda"))
                            .With(h => h.Quantity = Faker.RandomNumber.Next(1, 1000) * (h.ActionID == 1 ? 1 : -1))
                            .With(h => h.Date = DateTime.Now.AddDays(-daysGenerator.Next(1, 100)))
                        .Build();

                    _dbContext.Histories.AddRange(histories.ToArray());
                    _dbContext.SaveChanges();
                }

                return Created("MockData", null);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }
}