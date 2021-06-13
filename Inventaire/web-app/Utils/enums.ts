export enum ACCOUNT_TYPE_TEXT {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
  NONE = 'None',
}

export enum ACCOUNT_TYPE_ID {
  ADMIN = 1,
  MANAGER = 2,
  EMPLOYEE = 3,
  NONE = 4,
}

export enum PAGES {
  ADMIN = '/admin',
  EMPLOYEES = '/employees',
  HISTORY = '/history',
  INVENTORY = '/', // index
  LOGIN = '/login',
  RENT = '/rent',
  SETTINGS = '/settings',
  SIGNUP = '/signup',
  SCAN = '/scan',
  PRODUCTS = '/products',
  WAREHOUSES = '/warehouses',
}

export enum CONTROLLERS {
  AUTH = '/api/Auth',
  CATEGORY = '/api/Category',
  HISTORY = '/api/History',
  MOCK_DATA = '/api/MockData',
  PRODUCT_AVAILABILITY = '/api/ProductAvailability',
  PRODUCT = '/api/Product',
  PRODUCT_RENTED = '/api/ProductRented',
  USER = '/api/User',
  WAREHOUSE = '/api/Warehouse',
}
