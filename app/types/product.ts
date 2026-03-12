export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;       // 計算値（inventory_lotsのSUM）。直接編集不可
  tags?: string[];
}

export interface InventoryLot {
  id: string;
  productId: string;
  quantity: number;
  expirationDate: string;   // YYYY-MM-DD
  receivedAt: string;       // ISO datetime
  lotNumber?: string;
  status: 'active' | 'expired' | 'disposed';
  note?: string;
}

export interface AddInventoryLotInput {
  productId: string;
  quantity: number;
  expirationDate: string;   // YYYY-MM-DD
  lotNumber?: string;
}

export interface AdjustInventoryInput {
  lotId: string;
  newQuantity: number;
  reason: string;            // 廃棄理由・調整メモ
}

/** 商品の在庫サマリ情報 */
export interface ProductStockSummary {
  totalStock: number;
  nearestExpiration: string | null;   // YYYY-MM-DD or null
  activeLotCount: number;
}

/** 商品＋在庫ロット詳細（商品詳細画面向け） */
export interface ProductLotDetail {
  product: Product;
  lots: InventoryLot[];               // active ロットのみ、賞味期限昇順
  stockSummary: ProductStockSummary;
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