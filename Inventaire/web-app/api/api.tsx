import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  Method,
} from 'axios';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { API_BASE_URL } from '../config';
import { IApiRes } from './types';

interface ICtx extends NextPageContext {}

/**
 *
 * @param method method type
 * @param url targeted api endpoint
 * @param body object body, can be empty
 * @returns
 */
export const publicAPI = async (
  method: Method,
  url: string,
  body: any = {},
): Promise<IApiRes<any>> => {
  const options: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    url,
    data: body,
  };

  return await axios(options)
    .then((response: AxiosResponse) => {
      return { success: true, ...response.data };
    })
    .catch((error: AxiosError) => {
      return error.response
        ? { success: false, ...error.response.data }
        : { success: false, message: error.name, data: error.code };
    });
};
export const getToken = async (ctx: ICtx | undefined) => {
  const session = ctx ? await getSession(ctx) : await getSession();

  return session.accessToken;
};

/**
 *
 * @param method method type
 * @param url targeted api endpoint
 * @param body object body, can be empty
 * @param ctx optional, provide if function is called sever side ex.: getServerSideProps
 * @param token optional, DO NOT USE, only for session update
 * @returns
 */
export const authAPI = async (
  method: Method,
  url: string,
  body: any = {},
  ctx: ICtx = undefined,
  token: string = undefined,
): Promise<IApiRes<any>> => {
  const options: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || (await getToken(ctx))}`,
    },
    method,
    url,
    data: body,
  };

  return await axios(options)
    .then((response: AxiosResponse) => {
      return { success: true, ...response.data };
    })
    .catch((error: AxiosError) => {
      return error.response
        ? { success: false, ...error.response.data }
        : { success: false, message: error.name, data: error.code };
    });
};
