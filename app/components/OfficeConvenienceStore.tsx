import { useState, useEffect } from 'react';
import { ProductTile } from '../components/ProductTile';
import { CartButton } from '../components/CartButton';
import { getProducts, initializeSampleProducts } from '../services/productService';
import type { Product } from '../types/product';

export function OfficeConvenienceStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // 開発環境でサンプルデータを初期化
        await initializeSampleProducts();
        
        // 商品データを取得
        const productsData = await getProducts();
        setProducts(productsData);
        
      } catch (err) {
        console.error('商品の読み込みに失敗しました:', err);
        setError('商品の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-orange-500 dark:bg-orange-600 shadow-sm border-b border-orange-600 dark:border-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Remixオフィスコンビニ (Firebase + Emulator)
              </h1>
              <p className="text-sm text-orange-100 dark:text-orange-200 mt-1">
                商品を選択して＋ボタンでカートに追加してください
              </p>
            </div>
            <a
              href="/admin/products"
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              🖼️ 画像管理
            </a>
          </div>
        </div>
      </header>

      {/* 商品グリッド */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">商品を読み込み中...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-600 dark:text-red-400">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* カートボタン */}
      <CartButton />
    </div>
  );
}