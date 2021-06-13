import { NextPageContext } from 'next';
import { Product, ProductName } from '../../types/product';
import { CONTROLLERS } from '../../Utils/enums';
import { authAPI } from '../api';
import { IApiRes } from '../types';

export async function GetProductDetails(id: string): Promise<IApiRes<Product>> {
  const res = await authAPI('GET', CONTROLLERS.PRODUCT + `/${id}`, {});
  return res;
}

export async function EditProductQuantity(
  productId: string,
  warehouseId: number,
  quantity: number,
): Promise<IApiRes<object>> {
  const res = await authAPI('PUT', CONTROLLERS.PRODUCT_AVAILABILITY, {
    productID: productId,
    warehouseID: warehouseId,
    quantity: quantity,
  });
  return res;
}

export async function SetProductQuantity(
  productId: string,
  warehouseId: number,
  quantity: number,
): Promise<IApiRes<object>> {
  const res = await authAPI('PATCH', CONTROLLERS.PRODUCT_AVAILABILITY, {
    productID: productId,
    warehouseID: warehouseId,
    quantity: quantity,
  });
  return res;
}

export async function AddProductAvailability(
  productId: string,
  warehouseId: number,
  quantity: number,
): Promise<IApiRes<object>> {
  const res = await authAPI('POST', CONTROLLERS.PRODUCT_AVAILABILITY, {
    productID: productId,
    warehouseID: warehouseId,
    quantity: quantity,
  });
  return res;
}

interface ICtx extends NextPageContext {}

export async function GetProducts(ctx: ICtx): Promise<IApiRes<Product[]>> {
  const res = await authAPI('GET', CONTROLLERS.PRODUCT, {}, ctx);
  return res;
}

export async function GetProductsNames(
  ctx: ICtx,
): Promise<IApiRes<ProductName[]>> {
  const res = await authAPI('GET', CONTROLLERS.PRODUCT + '/names', {}, ctx);
  return res;
}

export async function EditProductInfo(
  productId: string,
  categoryId: number,
  productName: string,
  description: string,
  weight: number,
): Promise<IApiRes<object>> {
  const res = await authAPI('PATCH', CONTROLLERS.PRODUCT + '/' + productId, {
    productID: productId,
    categoryID: categoryId,
    name: productName,
    description: description,
    weight: weight,
  });
  return res;
}

export async function AddProduct(
  categoryId: number,
  productName: string,
  description: string,
  weight: number,
): Promise<IApiRes<object>> {
  const res = await authAPI('POST', CONTROLLERS.PRODUCT, {
    categoryID: categoryId,
    name: productName,
    description: description,
    weight: weight,
  });
  return res;
}
