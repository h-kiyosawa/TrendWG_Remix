import { sampleProducts } from '../data/products';
import { ProductTile } from '../components/ProductTile';
import { CartButton } from '../components/CartButton';

export function OfficeConvenienceStore() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-orange-500 dark:bg-orange-600 shadow-sm border-b border-orange-600 dark:border-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-white">
            Remixオフィスコンビニ
          </h1>
          <p className="text-sm text-orange-100 dark:text-orange-200 mt-1">
            商品を選択して＋ボタンでカートに追加してください
          </p>
        </div>
      </header>

      {/* 商品グリッド */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sampleProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* カートボタン */}
      <CartButton />
    </div>
  );
}