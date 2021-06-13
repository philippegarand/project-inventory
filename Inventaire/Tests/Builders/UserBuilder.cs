using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Models;
using Repository.Models.Enums;

namespace Tests.Builders
{
    public class UserBuilder
    {
        private readonly User user = new User();

        public UserBuilder WithId(Guid id)
        {
            user.UserID = id;
            return this;
        }

        public UserBuilder WithAccountType(AccountTypeEnum accountType)
        {
            user.AccountTypeID = (int)accountType;
            return this;
        }

        public UserBuilder WithEmail(string email)
        {
            user.Email = email;
            return this;
        }

        public UserBuilder WithPassword(string password)
        {
            user.Password = password;
            return this;
        }

        public UserBuilder WithSalt(string salt)
        {
            user.Salt = salt;
            return this;
        }

        public UserBuilder WithName(string name)
        {
            user.Name = name;
            return this;
        }

        public UserBuilder WithWarehouses(ICollection<Warehouse> warehouses)
        {
            user.Warehouses = warehouses;
            return this;
        }

        public User Build()
        {
            return user;
        }
    }
}