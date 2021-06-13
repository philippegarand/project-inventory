import { NextPageContext } from 'next';
import { INewEmployee, UserFromApi, IModifyEmployee } from '../../types/user';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

interface ICtx extends NextPageContext {}
export async function ChangeEmail(
  id: string,
  email: string,
): Promise<IApiRes<object>> {
  const res = await authAPI(
    'PATCH',
    CONTROLLERS.USER + `/${id}/email`,
    JSON.stringify(email),
  );
  return res;
}

export async function ChangePassword(
  id: string,
  oldPassword: string,
  newPassword: string,
): Promise<IApiRes<object>> {
  const res = await authAPI('PATCH', CONTROLLERS.USER + `/${id}/password`, {
    oldPassword,
    newPassword,
  });
  return res;
}

export async function GetUsers(ctx: ICtx): Promise<IApiRes<UserFromApi[]>> {
  const res = await authAPI('GET', CONTROLLERS.USER, {}, ctx);
  return res;
}

export async function AddEmployee(user: INewEmployee): Promise<IApiRes<any>> {
  const res = await authAPI('POST', CONTROLLERS.USER + `/employee`, {
    ...user,
  });
  return res;
}

export async function ModifyEmployee(
  user: IModifyEmployee,
): Promise<IApiRes<any>> {
  const res = await authAPI('PATCH', CONTROLLERS.USER + `/employee`, {
    ...user,
  });
  return res;
}
