using System;
using Microsoft.EntityFrameworkCore;
using Repository.Models;
using Repository.Models.Enums;

namespace Repository.DataAccess

{
    public class InventoryContext : DbContext
    {
        public InventoryContext(DbContextOptions<InventoryContext> options) : base(options)
        {
        }

        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<Models.Action> Actions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductAvailability> ProductsAvailability { get; set; }
        public DbSet<ProductRented> ProductsRented { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductAvailability>()
                    .HasKey(c => new { c.ProductID, c.WarehouseID });
            modelBuilder.Entity<User>()
                    .HasIndex(e => e.Email).IsUnique();

            // Base AccountTypes
            modelBuilder.Entity<AccountType>().HasData(
                new AccountType
                {
                    AccountTypeID = (int)AccountTypeEnum.ADMIN,
                    TypeName = "Admin",
                },
                new AccountType
                {
                    AccountTypeID = (int)AccountTypeEnum.MANAGER,
                    TypeName = "Manager",
                },
                new AccountType
                {
                    AccountTypeID = (int)AccountTypeEnum.EMPLOYEE,
                    TypeName = "Employee",
                },
                new AccountType
                {
                    AccountTypeID = (int)AccountTypeEnum.NONE,
                    TypeName = "None",
                }
            );

            // Base Actions
            modelBuilder.Entity<Models.Action>().HasData(
                new Models.Action
                {
                    ActionID = (int)ActionEnum.ADD,
                    Name = "Add",
                },
                new Models.Action
                {
                    ActionID = (int)ActionEnum.REMOVE,
                    Name = "Remove",
                }
            );

            // Base admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = new Guid("bad730d5-f540-4118-ac17-6ba319ddfcda"),
                    AccountTypeID = (int)AccountTypeEnum.ADMIN,
                    Email = "admin@admin.com",
                    Password = "YnP2RC97KaKYeDAf5Ro9Hw==", // admin
                    Salt = "Tg4LLSGhiP13z0iSEHf/IQ==",
                    Name = "Admin",
                });
        }
    }
}