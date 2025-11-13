import { Pool } from 'pg';
import type { DatabaseAdapter } from './database';
import type { Product, CartItem } from '../types/product';

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
      const result = await client.query('SELECT * FROM products ORDER BY name');
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        image: row.image,
        description: row.description,
        category: row.category,
        stock: row.stock
      }));
    } finally {
      client.release();
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        price: row.price,
        image: row.image,
        description: row.description,
        category: row.category,
        stock: row.stock
      };
    } finally {
      client.release();
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO products (name, price, image, description, category, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [product.name, product.price, product.image, product.description, product.category || 'food', product.stock || 0]
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
          p.id, p.name, p.price, p.image, p.description, p.category, p.stock,
          c.quantity
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
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
          stock: row.stock
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

  async close(): Promise<void> {
    await this.pool.end();
  }
}