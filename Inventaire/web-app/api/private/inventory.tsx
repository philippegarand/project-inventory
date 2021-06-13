import { NextPageContext } from 'next';
import { IProdAv } from '../../types/productAvailability';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

interface ICtx extends NextPageContext {}
export async function GetInventoryByWarehouse(
  id: number,
): Promise<IApiRes<IProdAv[]>> {
  const res = await authAPI(
    'GET',
    CONTROLLERS.PRODUCT_AVAILABILITY + `/warehouse/${id}`,
    {},
  );
  return res;
}
