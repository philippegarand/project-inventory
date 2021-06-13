import { CONTROLLERS } from '../../Utils/enums';
import { INewUser } from '../../types/user';
import { IApiRes } from '../types';
import { authAPI, publicAPI } from '../api';
import { User } from 'next-auth';

export async function Login(
  email: string,
  password: string,
): Promise<IApiRes<object>> {
  const res = await publicAPI('POST', CONTROLLERS.AUTH + '/login', {
    email,
    password,
  });
  return res;
}

export async function Signup(newUser: INewUser): Promise<IApiRes<object>> {
  const res = await publicAPI('POST', CONTROLLERS.AUTH + '/register', {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
  });
  return res;
}

export async function UpdateSessionUser(
  accessToken: string,
  userId: string,
): Promise<IApiRes<User>> {
  const res = await authAPI(
    'GET',
    CONTROLLERS.AUTH + `/sessionUpdate/${userId}`,
    {},
    undefined,
    accessToken,
  );
  return res;
}
