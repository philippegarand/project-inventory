import { NextPageContext } from 'next';

import { API_BASE_URL } from '../../config';
import { Log } from '../../types/history';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI, getToken } from '../api';
import { IApiRes } from '../types';

interface ICtx extends NextPageContext {}

export async function GetHistories(ctx: ICtx): Promise<IApiRes<Log[]>> {
  const res = await authAPI('GET', CONTROLLERS.HISTORY, {}, ctx);
  return res;
}
