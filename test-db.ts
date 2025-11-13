import dotenv from 'dotenv';
import { DatabaseFactory } from './app/lib/database';

// .envファイルを読み込み
dotenv.config();

async function testDatabase() {
  try {
    console.log('データベース接続をテスト中...');
    const db = await DatabaseFactory.create();
    
    console.log('商品データを取得中...');
    const products = await db.getProducts();
    
    console.log(`取得した商品数: ${products.length}`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ¥${product.price} (${product.category})`);
    });
    
  } catch (error) {
    console.error('テスト失敗:', error);
  }
}

testDatabase();