using API.Services.Entities;
using Repository.Models;

namespace API.Services.Abstraction
{
    public interface IAuthService
    {
        AuthData GetAuthData(User user);

        public ServiceResponse<AuthData> VerifyLogin(User user, string credentialsPassword);
    }
}