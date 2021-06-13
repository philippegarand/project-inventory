export interface MinimalWarehouse {
  id: number;
  name: string;
}

export interface Warehouse {
  warehouseID: number;
  name: string;
  country: string;
  postalCode: string;
  address: string;
  users: any[];
}
