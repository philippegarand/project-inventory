import { NextPageContext } from 'next';
import { Category } from '../../types/category';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

interface ICtx extends NextPageContext {}

export async function GetCategories(ctx: ICtx): Promise<IApiRes<Category[]>> {
  const res = await authAPI('GET', CONTROLLERS.CATEGORY, {}, ctx);
  return res;
}

export async function AddCategory(
  category: Category,
): Promise<IApiRes<Category>> {
  const res = await authAPI('POST', CONTROLLERS.CATEGORY, category);
  return res;
}
