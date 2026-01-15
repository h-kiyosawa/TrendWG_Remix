export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
  tags?: string[];
}

export interface SalesRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  soldAt: Date;
  userId?: string;
}

export interface DailySalesSummary {
  saleDate: string;
  totalRevenue: number;
  totalItems: number;
  transactionCount: number;
}

export interface ProductSalesSummary {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  saleCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  displayOrder?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}