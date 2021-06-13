import { NextPageContext } from 'next';
import { Warehouse } from '../../types/warehouse';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

interface ICtx extends NextPageContext {}
export async function GetWarehouses(ctx: ICtx): Promise<IApiRes<Warehouse[]>> {
  const res = await authAPI('GET', CONTROLLERS.WAREHOUSE, {}, ctx);
  return res;
}

export async function AddWarehouse(warehouse: {
  name: string;
  address: string;
  country: string;
  postalCode: string;
}): Promise<IApiRes<unknown>> {
  const res = await authAPI('POST', CONTROLLERS.WAREHOUSE, {
    Name: warehouse.name,
    Address: warehouse.address,
    Country: warehouse.country,
    PostalCode: warehouse.postalCode,
  });
  return res;
}
