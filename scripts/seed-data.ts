import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// サンプル商品データ
const sampleProducts = [
  {
    id: '1',
    name: 'おにぎり（鮭）',
    price: 120,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍙 鮭%3C/text%3E%3C/svg%3E',
    description: '新鮮な鮭を使用したおにぎり',
    category: 'food',
    stock: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'おにぎり（梅）',
    price: 110,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍙 梅%3C/text%3E%3C/svg%3E',
    description: '定番の梅おにぎり',
    category: 'food',
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'サンドイッチ（ハム＆チーズ）',
    price: 180,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥪 ハム%3C/text%3E%3C/svg%3E',
    description: 'ハムとチーズのサンドイッチ',
    category: 'food',
    stock: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'ペットボトル緑茶',
    price: 150,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍵 緑茶%3C/text%3E%3C/svg%3E',
    description: '500ml緑茶',
    category: 'drink',
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'コーヒー（ブラック）',
    price: 130,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E☕ ブラック%3C/text%3E%3C/svg%3E',
    description: '缶コーヒー（無糖）',
    category: 'drink',
    stock: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'カップラーメン',
    price: 200,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍜 ラーメン%3C/text%3E%3C/svg%3E',
    description: 'チキン味カップラーメン',
    category: 'food',
    stock: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: '野菜サラダ',
    price: 250,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥗 サラダ%3C/text%3E%3C/svg%3E',
    description: 'フレッシュ野菜サラダ',
    category: 'food',
    stock: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'チョコレート',
    price: 100,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍫 チョコ%3C/text%3E%3C/svg%3E',
    description: 'ミルクチョコレート',
    category: 'snack',
    stock: 35,
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'ポテトチップス',
    price: 120,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍟 チップス%3C/text%3E%3C/svg%3E',
    description: 'うすしお味',
    category: 'snack',
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'ヨーグルト',
    price: 80,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥛 ヨーグルト%3C/text%3E%3C/svg%3E',
    description: 'プレーンヨーグルト',
    category: 'food',
    stock: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'バナナ',
    price: 90,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍌 バナナ%3C/text%3E%3C/svg%3E',
    description: '1本',
    category: 'food',
    stock: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'アイスクリーム',
    price: 160,
    image: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍦 アイス%3C/text%3E%3C/svg%3E',
    description: 'バニラアイス',
    category: 'snack',
    stock: 10,
    createdAt: new Date().toISOString()
  }
];

// Firebase Admin を初期化（エミュレーター用）
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      projectId: 'demo-project'
    });
  }
  
  const db = getFirestore();
  
  // エミュレーターに接続
  if (process.env.NODE_ENV !== 'production') {
    db.settings({
      host: 'localhost:8080',
      ssl: false
    });
  }
  
  return db;
}

// 商品データをFirestoreに追加
async function seedProducts(db: any) {
  console.log('🌱 商品データを追加中...');
  
  const batch = db.batch();
  
  for (const product of sampleProducts) {
    const { id, ...productData } = product;
    const productRef = db.collection('products').doc(id);
    batch.set(productRef, productData);
  }
  
  await batch.commit();
  console.log(`✅ ${sampleProducts.length}件の商品データを追加しました`);
}

// カテゴリデータを追加
async function seedCategories(db: any) {
  console.log('🏷️ カテゴリデータを追加中...');
  
  const categories = [
    { id: 'food', name: '食品', icon: '🍱', order: 1 },
    { id: 'drink', name: '飲み物', icon: '🥤', order: 2 },
    { id: 'snack', name: 'お菓子', icon: '🍭', order: 3 }
  ];
  
  const batch = db.batch();
  
  for (const category of categories) {
    const { id, ...categoryData } = category;
    const categoryRef = db.collection('categories').doc(id);
    batch.set(categoryRef, {
      ...categoryData,
      createdAt: new Date().toISOString()
    });
  }
  
  await batch.commit();
  console.log(`✅ ${categories.length}件のカテゴリデータを追加しました`);
}

// 店舗設定データを追加
async function seedStoreSettings(db: any) {
  console.log('🏪 店舗設定データを追加中...');
  
  const storeSettings = {
    name: 'Remixオフィスコンビニ',
    description: 'オフィス内のセルフサービス店舗です',
    businessHours: {
      open: '09:00',
      close: '18:00',
      timezone: 'Asia/Tokyo'
    },
    taxRate: 0.1,
    currency: 'JPY',
    features: {
      cartEnabled: true,
      darkModeEnabled: true,
      categoriesEnabled: true,
      stockDisplayEnabled: true
    },
    theme: {
      primaryColor: '#f97316', // orange-500
      accentColor: '#ea580c'   // orange-600
    },
    updatedAt: new Date().toISOString()
  };
  
  await db.collection('settings').doc('store').set(storeSettings);
  console.log('✅ 店舗設定データを追加しました');
}

// メイン実行関数
async function main() {
  try {
    console.log('🚀 Firebase Emulator シードデータの作成を開始します...');
    console.log('📍 対象: demo-project (localhost:8080)');
    
    const db = initializeFirebaseAdmin();
    
    // 既存データのクリア
    console.log('🧹 既存データをクリア中...');
    
    // 各コレクションをクリア
    const collections = ['products', 'categories', 'settings'];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    
    // シードデータを追加
    await seedCategories(db);
    await seedProducts(db);
    await seedStoreSettings(db);
    
    console.log('');
    console.log('🎉 シードデータの作成が完了しました！');
    console.log('');
    console.log('📊 作成されたデータ:');
    console.log(`   • 商品: ${sampleProducts.length}件`);
    console.log('   • カテゴリ: 3件');
    console.log('   • 店舗設定: 1件');
    console.log('');
    console.log('🌐 Emulator UI でデータを確認してください:');
    console.log('   http://localhost:4000');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  main();
}