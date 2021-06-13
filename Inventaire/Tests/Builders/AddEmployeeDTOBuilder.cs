using API.Entities.DTOs;

namespace Tests.Builders
{
    public class AddEmployeeDTOBuilder
    {
        private readonly AddEmployeeDTO addEmployeeDTO = new AddEmployeeDTO();

        public AddEmployeeDTOBuilder WithEmail(string email)
        {
            addEmployeeDTO.Email = email;
            return this;
        }

        public AddEmployeeDTOBuilder WithName(string name)
        {
            addEmployeeDTO.Name = name;
            return this;
        }

        public AddEmployeeDTOBuilder WithPassword(string password)
        {
            addEmployeeDTO.Password = password;
            return this;
        }

        public AddEmployeeDTOBuilder WithWarehousesIDs(int[] warehousesIDs)
        {
            addEmployeeDTO.WarehouseIDs = warehousesIDs;
            return this;
        }

        public AddEmployeeDTOBuilder WithAccountTypeID(int accountTypeID)
        {
            addEmployeeDTO.AccountTypeID = accountTypeID;
            return this;
        }

        public AddEmployeeDTO Build()
        {
            return addEmployeeDTO;
        }
    }
}