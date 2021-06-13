import { Category } from './category';

export interface Product {
  productID: string;
  category: Category;
  name: string;
  description: string;
  weight: number;
}

export interface ProductName {
  productID: string;
  name: string;
}
export interface ProductToAPI {
  productID: string;
  categoryID: number;
  name: string;
  description: string;
  weight: number;
}

export interface addProductToBD {
  categoryID: number;
  name: string;
  description: string;
  weight: number;
}
