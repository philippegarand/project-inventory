using API.Services.Abstraction;
using Repository.DataAccess;
using Repository.Models;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API.Helpers;
using API.Services.Entities;
using API.Entities.DTOs;

namespace API.Services
{
    public class UserService : BaseService<User, Guid>, IUserService
    {
        public UserService(IRepository<User, Guid> repo) : base(repo)
        {
        }

        public async new Task<ServiceResponse<User>> Add(User user)
        {
            var salt = PasswordHelper.GenSalt();

            user.Password = Convert.ToBase64String(PasswordHelper.HashPassword(user.Password, salt));
            user.Salt = Convert.ToBase64String(salt);

            if (GetByEmail(user.Email) == default)
            {
                return await base.Add(user);
            }

            return new ServiceResponse<User>(HttpStatusCode.Conflict, "Email already Used");
        }

        public User GetByEmail(string email)
        {
            return _repo.GetWhere(u => u.Email == email).FirstOrDefault();
        }

        public async Task<ServiceResponse<User>> UpdateEmail(string newEmail, Guid id)
        {
            if (GetByEmail(newEmail) == null)
            {
                var user = await _repo.GetById(id);
                user.Email = newEmail;
                return await base.Update(user);
            }

            return new ServiceResponse<User>(HttpStatusCode.Conflict, "Email already Used");
        }

        //TODO: we should not use DTO here. Should we create an object specially for password change?
        public async Task<ServiceResponse<User>> UpdatePassword(ChangePasswordDTO passwords, Guid id)
        {
            var user = await _repo.GetById(id);
            if (IsPasswordMatching(passwords.oldPassword, user))
            {
                user.Password = Convert.ToBase64String(PasswordHelper.HashPassword(passwords.newPassword, Convert.FromBase64String(user.Salt)));
                return await base.Update(user);
            }
            return new ServiceResponse<User>(HttpStatusCode.Conflict, "Old password doesn't match");
        }

        private bool IsPasswordMatching(string oldPassword, User user)
        {
            if (user == null)
            {
                return false;
            }

            return PasswordHelper.VerifHash(oldPassword,
                Convert.FromBase64String(user.Salt),
                Convert.FromBase64String(user.Password));
        }
    }
}