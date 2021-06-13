using API.Entities.DTOs;
using API.Services.Entities;
using Repository.Models;
using System;
using System.Threading.Tasks;

namespace API.Services.Abstraction
{
    public interface IUserService : IBaseService<User, Guid>
    {
        public User GetByEmail(string email);

        public Task<ServiceResponse<User>> UpdateEmail(string newEmail, Guid id);

        public Task<ServiceResponse<User>> UpdatePassword(ChangePasswordDTO passwords, Guid id);
    }
}