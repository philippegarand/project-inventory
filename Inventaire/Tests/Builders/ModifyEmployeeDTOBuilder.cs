using API.Entities.DTOs;
using System;

namespace Tests.Builders
{
    public class ModifyEmployeeDTOBuilder
    {
        private readonly ModifyEmployeeDTO modifyEmployeeDTO = new ModifyEmployeeDTO();

        public ModifyEmployeeDTOBuilder WithUserID(Guid id)
        {
            modifyEmployeeDTO.UserID = id;
            return this;
        }

        public ModifyEmployeeDTOBuilder WithName(string name)
        {
            modifyEmployeeDTO.Name = name;
            return this;
        }

        public ModifyEmployeeDTOBuilder WithWarehousesIDs(int[] warehousesIDs)
        {
            modifyEmployeeDTO.WarehouseIDs = warehousesIDs;
            return this;
        }

        public ModifyEmployeeDTOBuilder WithAccountTypeID(int accountTypeID)
        {
            modifyEmployeeDTO.AccountTypeID = accountTypeID;
            return this;
        }

        public ModifyEmployeeDTO Build()
        {
            return modifyEmployeeDTO;
        }
    }
}