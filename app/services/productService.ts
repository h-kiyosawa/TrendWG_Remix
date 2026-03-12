import type { Product, InventoryLot, AddInventoryLotInput, ProductLotDetail } from '../types/product';
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

// ========== 在庫ロット関連 ==========

/**
 * 商品に紐づく在庫ロット一覧を取得
 */
export async function getInventoryLots(productId: string): Promise<InventoryLot[]> {
  try {
    const db = await DatabaseFactory.create();
    return await db.getInventoryLots(productId);
  } catch (error) {
    console.error('在庫ロットの取得に失敗しました:', error);
    throw error;
  }
}

/**
 * 在庫ロットを追加（入荷）
 */
export async function addInventoryLot(input: AddInventoryLotInput): Promise<string> {
  try {
    const db = await DatabaseFactory.create();
    return await db.addInventoryLot(input);
  } catch (error) {
    console.error('在庫ロットの追加に失敗しました:', error);
    throw error;
  }
}

/**
 * 在庫ロットの数量を調整
 */
export async function adjustInventoryLot(lotId: string, newQuantity: number, reason: string): Promise<void> {
  try {
    const db = await DatabaseFactory.create();
    await db.adjustInventoryLot(lotId, newQuantity, reason);
  } catch (error) {
    console.error('在庫ロットの調整に失敗しました:', error);
    throw error;
  }
}

/**
 * 在庫ロットを廃棄
 */
export async function disposeInventoryLot(lotId: string, reason: string): Promise<void> {
  try {
    const db = await DatabaseFactory.create();
    await db.disposeInventoryLot(lotId, reason);
  } catch (error) {
    console.error('在庫ロットの廃棄に失敗しました:', error);
    throw error;
  }
}

/**
 * 有効（active）な在庫ロットのみ取得（賞味期限昇順）
 */
export async function getActiveInventoryLots(productId: string): Promise<InventoryLot[]> {
  try {
    const db = await DatabaseFactory.create();
    return await db.getActiveInventoryLots(productId);
  } catch (error) {
    console.error('有効在庫ロットの取得に失敗しました:', error);
    throw error;
  }
}

/**
 * 商品情報＋在庫ロット詳細＋在庫サマリをまとめて取得（商品詳細画面向け）
 */
export async function getProductWithLots(productId: string): Promise<ProductLotDetail | null> {
  try {
    const db = await DatabaseFactory.create();
    return await db.getProductWithLots(productId);
  } catch (error) {
    console.error('商品ロット詳細の取得に失敗しました:', error);
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