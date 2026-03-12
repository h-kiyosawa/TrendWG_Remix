import { Pool } from 'pg';
import type { DatabaseAdapter } from './database';
import type { Product, CartItem, InventoryLot, AddInventoryLotInput, ProductLotDetail } from '../types/product';

export class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'office_convenience_store',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
    });
  }

  async getProducts(): Promise<Product[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT p.*, COALESCE(s.total_stock, 0) AS stock
        FROM products p
        LEFT JOIN product_stock_summary s ON p.id = s.product_id
        ORDER BY p.name
      `);
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        image: row.image,
        description: row.description,
        category: row.category,
        stock: parseInt(row.stock) || 0
      }));
    } finally {
      client.release();
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT p.*, COALESCE(s.total_stock, 0) AS stock
        FROM products p
        LEFT JOIN product_stock_summary s ON p.id = s.product_id
        WHERE p.id = $1
      `, [id]);
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        price: row.price,
        image: row.image,
        description: row.description,
        category: row.category,
        stock: parseInt(row.stock) || 0
      };
    } finally {
      client.release();
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO products (name, price, image, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [product.name, product.price, product.image, product.description, product.category || 'food']
      );
      return result.rows[0].id;
    } finally {
      client.release();
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const client = await this.pool.connect();
    try {
      const fields = Object.keys(updates).filter(key => key !== 'id');
      const values = fields.map(field => updates[field as keyof Product]);
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      await client.query(
        `UPDATE products SET ${setClause} WHERE id = $1`,
        [id, ...values]
      );
    } finally {
      client.release();
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM products WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  async getCartItems(userId: string = 'default'): Promise<CartItem[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          p.id, p.name, p.price, p.image, p.description, p.category,
          COALESCE(s.total_stock, 0) AS stock,
          c.quantity
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        LEFT JOIN product_stock_summary s ON p.id = s.product_id
        WHERE c.user_id = $1
      `, [userId]);
      
      return result.rows.map(row => ({
        product: {
          id: row.id,
          name: row.name,
          price: row.price,
          image: row.image,
          description: row.description,
          category: row.category,
          stock: parseInt(row.stock) || 0
        },
        quantity: row.quantity
      }));
    } finally {
      client.release();
    }
  }

  async addToCart(productId: string, quantity: number, userId: string = 'default'): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + $3
      `, [userId, productId, quantity]);
    } finally {
      client.release();
    }
  }

  async updateCartItem(productId: string, quantity: number, userId: string = 'default'): Promise<void> {
    const client = await this.pool.connect();
    try {
      if (quantity <= 0) {
        await client.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
      } else {
        await client.query(
          'UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2',
          [userId, productId, quantity]
        );
      }
    } finally {
      client.release();
    }
  }

  async removeFromCart(productId: string, userId: string = 'default'): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    } finally {
      client.release();
    }
  }

  async clearCart(userId: string = 'default'): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    } finally {
      client.release();
    }
  }

  async getCategories(): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM categories ORDER BY display_order');
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getStoreSettings(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM store_settings WHERE id = $1', ['default']);
      return result.rows[0] || {};
    } finally {
      client.release();
    }
  }

  async updateStoreSettings(settings: any): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO store_settings (id, settings, updated_at)
        VALUES ('default', $1, NOW())
        ON CONFLICT (id)
        DO UPDATE SET settings = $1, updated_at = NOW()
      `, [JSON.stringify(settings)]);
    } finally {
      client.release();
    }
  }

  // ========== 在庫ロット関連 ==========

  async getInventoryLots(productId: string): Promise<InventoryLot[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM inventory_lots WHERE product_id = $1 ORDER BY expiration_date ASC, created_at ASC`,
        [productId]
      );
      return result.rows.map(row => this.mapRowToInventoryLot(row));
    } finally {
      client.release();
    }
  }

  async getActiveInventoryLots(productId: string): Promise<InventoryLot[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM inventory_lots
         WHERE product_id = $1 AND status = 'active' AND quantity > 0
         ORDER BY expiration_date ASC, created_at ASC`,
        [productId]
      );
      return result.rows.map(row => this.mapRowToInventoryLot(row));
    } finally {
      client.release();
    }
  }

  async getProductWithLots(productId: string): Promise<ProductLotDetail | null> {
    const client = await this.pool.connect();
    try {
      // 商品情報 + 在庫サマリを取得
      const productResult = await client.query(`
        SELECT p.*, COALESCE(s.total_stock, 0) AS stock,
               s.nearest_expiration, s.active_lot_count
        FROM products p
        LEFT JOIN product_stock_summary s ON p.id = s.product_id
        WHERE p.id = $1
      `, [productId]);

      if (productResult.rows.length === 0) return null;

      const row = productResult.rows[0];
      const product: Product = {
        id: String(row.id),
        name: row.name,
        price: row.price,
        image: row.image,
        description: row.description,
        category: row.category,
        stock: parseInt(row.stock) || 0,
      };

      // active なロット一覧を取得（賞味期限昇順）
      const lotsResult = await client.query(
        `SELECT * FROM inventory_lots
         WHERE product_id = $1 AND status = 'active' AND quantity > 0
         ORDER BY expiration_date ASC, created_at ASC`,
        [productId]
      );
      const lots = lotsResult.rows.map(r => this.mapRowToInventoryLot(r));

      const nearestExp = row.nearest_expiration instanceof Date
        ? row.nearest_expiration.toISOString().split('T')[0]
        : row.nearest_expiration ? String(row.nearest_expiration) : null;

      return {
        product,
        lots,
        stockSummary: {
          totalStock: parseInt(row.stock) || 0,
          nearestExpiration: nearestExp,
          activeLotCount: parseInt(row.active_lot_count) || 0,
        },
      };
    } finally {
      client.release();
    }
  }

  async addInventoryLot(input: AddInventoryLotInput): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO inventory_lots (product_id, quantity, expiration_date, lot_number, status)
         VALUES ($1, $2, $3, $4, 'active') RETURNING id`,
        [input.productId, input.quantity, input.expirationDate, input.lotNumber || null]
      );
      return String(result.rows[0].id);
    } finally {
      client.release();
    }
  }

  async adjustInventoryLot(lotId: string, newQuantity: number, reason: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        `UPDATE inventory_lots SET quantity = $2, note = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [lotId, newQuantity, reason]
      );
    } finally {
      client.release();
    }
  }

  async disposeInventoryLot(lotId: string, reason: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        `UPDATE inventory_lots SET status = 'disposed', quantity = 0, note = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [lotId, reason]
      );
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // ========== プライベートヘルパー ==========

  private mapRowToInventoryLot(row: any): InventoryLot {
    return {
      id: String(row.id),
      productId: String(row.product_id),
      quantity: row.quantity,
      expirationDate: row.expiration_date instanceof Date
        ? row.expiration_date.toISOString().split('T')[0]
        : String(row.expiration_date),
      receivedAt: row.received_at instanceof Date
        ? row.received_at.toISOString()
        : String(row.received_at),
      lotNumber: row.lot_number || undefined,
      status: row.status as InventoryLot['status'],
      note: row.note || undefined,
    };
  }
}