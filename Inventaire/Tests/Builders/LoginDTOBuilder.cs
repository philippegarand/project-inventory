using API.Entities.DTOs;

namespace Tests.Builders
{
    public class LoginDTOBuilder
    {
        private readonly LoginDTO loginDTO = new LoginDTO();

        public LoginDTOBuilder WithEmail(string email)
        {
            loginDTO.Email = email;
            return this;
        }

        public LoginDTOBuilder WithPassword(string password)
        {
            loginDTO.Password = password;
            return this;
        }

        public LoginDTO Build()
        {
            return loginDTO;
        }
    }
}