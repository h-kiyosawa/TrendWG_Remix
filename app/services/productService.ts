import type { Product } from '../types/product';
import { sampleProducts } from '../data/products';
import { DatabaseFactory } from '../lib/database';

/**
 * 設定されたデータベースから全商品を取得
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const db = await DatabaseFactory.create();
    const products = await db.getProducts();
    
    // データが空の場合はサンプルデータを返す
    if (products.length === 0) {
      console.log('データベースにデータがありません。サンプルデータを返します。');
      return sampleProducts;
    }
    
    return products;
  } catch (error) {
    console.error('商品の取得に失敗しました:', error);
    // エラー時はローカルのサンプルデータを返す
    return sampleProducts;
  }
}

/**
 * 商品をデータベースに追加
 */
export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  try {
    const db = await DatabaseFactory.create();
    return await db.createProduct(product);
  } catch (error) {
    console.error('商品の追加に失敗しました:', error);
    throw error;
  }
}

/**
 * 商品をデータベースで更新
 */
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const db = await DatabaseFactory.create();
    await db.updateProduct(productId, updates);
  } catch (error) {
    console.error('商品の更新に失敗しました:', error);
    throw error;
  }
}

/**
 * 商品をデータベースから削除
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const db = await DatabaseFactory.create();
    await db.deleteProduct(productId);
  } catch (error) {
    console.error('商品の削除に失敗しました:', error);
    throw error;
  }
}

/**
 * 商品の変更をリアルタイムで監視（簡略化版）
 */
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  // PostgreSQLではリアルタイム監視は実装せず、定期的な取得に置き換え
  let intervalId: NodeJS.Timeout;
  
  const fetchData = async () => {
    try {
      const products = await getProducts();
      callback(products);
    } catch (error) {
      console.error('商品の監視に失敗しました:', error);
      callback(sampleProducts);
    }
  };
  
  // 初回実行
  fetchData();
  
  // 30秒ごとに更新（必要に応じて調整）
  intervalId = setInterval(fetchData, 30000);
  
  // クリーンアップ関数を返す
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

/**
 * サンプル商品データをFirestoreに初期化（開発環境用）
 */
export async function initializeSampleProducts(): Promise<void> {
  try {
    // 既存の商品をチェック
    const db = await DatabaseFactory.create();
    const existingProducts = await db.getProducts();
    
    if (existingProducts.length === 0) {
      console.log('サンプル商品データを初期化中...');
      
      // サンプル商品を一つずつ追加
      for (const product of sampleProducts) {
        const { id, ...productData } = product;
        await db.createProduct(productData);
      }
      
      console.log('サンプル商品データの初期化が完了しました');
    }
  } catch (error) {
    console.error('サンプル商品データの初期化に失敗しました:', error);
  }
}