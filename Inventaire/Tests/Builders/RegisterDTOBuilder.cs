using API.Entities.DTOs;

namespace Tests.Builders
{
    public class RegisterDTOBuilder
    {
        private readonly RegisterDTO registerDTO = new RegisterDTO();

        public RegisterDTOBuilder WithEmail(string email)
        {
            registerDTO.Email = email;
            return this;
        }

        public RegisterDTOBuilder WithName(string name)
        {
            registerDTO.Name = name;
            return this;
        }

        public RegisterDTOBuilder WithPassword(string password)
        {
            registerDTO.Password = password;
            return this;
        }

        public RegisterDTO Build()
        {
            return registerDTO;
        }
    }
}