import type { Product, CartItem } from '../types/product';

// データベース操作の共通インターフェース
export interface DatabaseAdapter {
  // 商品関連
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id'>): Promise<string>;
  updateProduct(id: string, updates: Partial<Product>): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  
  // カート関連（将来的にユーザー別カートを実装するため）
  getCartItems(userId?: string): Promise<CartItem[]>;
  addToCart(productId: string, quantity: number, userId?: string): Promise<void>;
  updateCartItem(productId: string, quantity: number, userId?: string): Promise<void>;
  removeFromCart(productId: string, userId?: string): Promise<void>;
  clearCart(userId?: string): Promise<void>;
  
  // カテゴリ関連
  getCategories(): Promise<any[]>;
  
  // 店舗設定
  getStoreSettings(): Promise<any>;
  updateStoreSettings(settings: any): Promise<void>;
}

// 環境設定
export interface DatabaseConfig {
  type: 'firebase' | 'postgresql';
  config: {
    // Firebase設定
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    
    // PostgreSQL設定
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  };
}

// データベースファクトリー
export class DatabaseFactory {
  static async create(): Promise<DatabaseAdapter> {
    const environment = process.env.NODE_ENV || 'development';
    const dbType = process.env.DATABASE_TYPE || (environment === 'production' ? 'firebase' : 'postgresql');
    
    switch (dbType) {
      case 'firebase':
        const { FirebaseAdapter } = await import('./firebase-adapter');
        return new FirebaseAdapter();
        
      case 'postgresql':
        const { PostgreSQLAdapter } = await import('./postgresql-adapter');
        return new PostgreSQLAdapter();
        
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}