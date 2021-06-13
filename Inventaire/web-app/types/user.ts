import { UseScrollTriggerOptions } from '@material-ui/core/useScrollTrigger/useScrollTrigger';
import { MinimalWarehouse, Warehouse } from './warehouse';

export interface INewUser {
  name: string;
  email: string;
  password: string;
}

export interface INewEmployee {
  accountTypeID: number;
  email: string;
  name: string;
  warehouseIDs: number[];
  password: string;
}

export interface IModifyEmployee {
  userID: string;
  accountTypeID: number;
  name: string;
  warehouseIDs: number[];
}

export interface IAuth {
  id: string;
  token: string;
  tokenExpirationTime: number;
}

export interface UserFromApi {
  userID: string;
  accountTypeID: number;
  accountType: any[];
  email: string;
  name: string;
  password: string;
  salt: string;
  warehouses: Warehouse[];
}

export interface Employee {
  id: string;
  accountTypeId: number;
  email: string;
  name: string;
  warehouses: MinimalWarehouse[];
}

export function mapToEmployee(userFromApi: UserFromApi): Employee {
  return {
    id: userFromApi.userID,
    accountTypeId: userFromApi.accountTypeID,
    email: userFromApi.email,
    name: userFromApi.name,
    warehouses: userFromApi.warehouses.map((w) => ({
      id: w.warehouseID,
      name: w.name,
    })),
  };
}

export function mapToModifyEmployee(user: Employee): IModifyEmployee {
  var modifiyEmployee: IModifyEmployee;
  modifiyEmployee = {
    userID: user.id,
    accountTypeID: user.accountTypeId,
    name: user.name,
    warehouseIDs: user.warehouses.map((w) => w.id),
  };

  return modifiyEmployee;
}
