import 'next-auth';
import { MinimalWarehouse } from './warehouse';

declare module 'next-auth' {
  interface User {
    id: string;
    role: number;
    accessToken: string;
    name: string;
    email: string;
    warehouses: MinimalWarehouse[];
  }
}
