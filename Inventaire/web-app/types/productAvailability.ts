import { Product } from './product';
import { Warehouse } from './warehouse';

export interface IProdAv {
  product: Product;
  productID: string;
  warehouse: Warehouse;
  warehouseID: number;
  quantity: number;
}
