import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductTile } from '../components/ProductTile';
import { CartButton } from '../components/CartButton';
import { getProducts, initializeSampleProducts } from '../services/productService';
import type { Product } from '../types/product';

export function OfficeConvenienceStore() {
  // 型は大文字の Product を使用
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 検索：入力値（searchInput）と、ボタン押下/Enterで確定されるクエリ（appliedQuery）
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await initializeSampleProducts();
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

  // Escape でモーダルを閉じる
  useEffect(() => {
    if (!selectedProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProduct]);

  // 画像URLの候補を返す（拡張子あり/なし対応、最後にプレースホルダー）
  const getImageUrls = (p: Product): string[] => {
    if (!p.image) return ['/images/products/placeholder.svg'];
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(p.image)) return [p.image];
    const base = p.image;
    return [
      `${base}.jpg`,
      `${base}.jpeg`,
      `${base}.png`,
      `${base}.webp`,
      `${base}.gif`,
      `${base}.svg`,
      '/images/products/placeholder.svg',
    ];
  };

  // 検索ボタン押下/Enter時に検索を確定 → 表示側に反映
  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();
      setAppliedQuery(searchInput.trim());
    },
    [searchInput]
  );

  // 表示対象：商品名の「部分一致」フィルタ（appliedQuery が空なら全件）
  const filteredProducts = useMemo(() => {
    const q = appliedQuery.toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, appliedQuery]);

  return (
    <div className="mx-auto p-4">
      {/* ===== オレンジ色ヘッダー（スクショ準拠） ===== */}
      <div className="rounded-lg shadow-md bg-orange-500 px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* 左：タイトル＆サブテキスト */}
          <div className="text-white">
            <h2 className="text-2xl font-semibold">Remixオフィスコンビニ</h2>
            <p className="text-sm/6 opacity-95">
              商品を選択して ＋ ボタンでカートに追加してください
            </p>
          </div>

          {/* 右側：トップに戻る + 検索 */}
          <div className="flex items-center gap-3">
            {/* トップに戻る（pill風ボタン） */}
            <a
              href="/"
              className="inline-block rounded-full bg-orange-400/90 hover:bg-orange-300 text-white px-4 py-2 text-sm shadow transition"
              aria-label="トップに戻る"
            >
              ← トップに戻る
            </a>

            {/* 検索（テキスト右に検索ボタン） */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  name="q"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="商品名で検索"
                  aria-label="商品名で検索"
                  className="w-64 rounded-full bg-white pl-8 pr-3 py-2 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                onClick={() => handleSearchSubmit()}
                className="rounded-full bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm font-medium shadow"
                aria-label="検索を実行"
              >
                検索
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== 商品リスト：PC（100%表示）で6列になるよう調整 ===== */}
      <div className="mt-4">
        {loading ? (
          <div>商品を読み込み中...</div>
        ) : error ? (
          <div role="alert" className="text-red-600">
            {error}
          </div>
        ) : (
          <ul
            className="
              grid gap-4
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            "
            aria-live="polite"
          >
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <button
                  className="block w-full text-left"
                  onClick={() => setSelectedProduct(product)}
                  aria-label={`${product.name} の詳細を開く`}
                >
                  <ProductTile product={product} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== 詳細モーダル ===== */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          imageUrls={getImageUrls(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ===== フローティングのカートボタン ===== */}
      <CartButton />
    </div>
  );
}

function ProductDetailModal({
  product,
  imageUrls,
  onClose,
}: {
  product: Product;
  imageUrls: string[];
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setImgIdx(0);
  }, [product]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
      className="fixed inset-0 bg-black/50 grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow max-w-lg w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 id="product-dialog-title" className="text-lg font-semibold">
            商品詳細
          </h3>
          <button aria-label="閉じる" onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        <div className="mb-3">
          <img
            src={imageUrls[imgIdx]}
            alt={product.name}
            className="w-full object-contain max-h-64"
            onError={() => {
              if (imgIdx < imageUrls.length - 1) {
                setImgIdx(imgIdx + 1);
              }
            }}
            loading="lazy"
          />
        </div>

        <dl className="space-y-1">
          <div>
            <dt className="text-sm text-gray-500">商品名</dt>
            <dd className="font-medium">{product.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">価格</dt>
            <dd className="font-medium">{Number(product.price).toLocaleString()}円</dd>
          </div>
          {product.description && (
            <div>
              <dt className="text-sm text-gray-500">説明</dt>
              <dd>{product.description}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="border rounded px-3 py-1">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
