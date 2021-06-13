import { NextPageContext } from 'next';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

export async function AddDummyData(settings: {
  nbCategories: Number;
  nbProducts: Number;
  nbProductAvailabilities: Number;
  nbWarehouses: Number;
  nbHistories: Number;
}): Promise<IApiRes<any>> {
  const res = await authAPI('POST', CONTROLLERS.MOCK_DATA, settings);

  return res;
}
