import { useEffect, useMemo, useState } from 'react';
import { ProductTile } from '../components/ProductTile';
import { getProducts, initializeSampleProducts } from '../services/productService';
import type { Product } from '../types/product';

export function SellManagementScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ 追加：詳細表示対象
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    // ✅ 追加：ESCで閉じる
    useEffect(() => {
        if (!selectedProduct) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedProduct(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedProduct]);

    // ✅ 画像URL取得（あなたのProduct型に合わせてここだけ調整すればOK）
    const getImageUrl = (p: Product) => {
        // すでに拡張子があればそのまま
        if (!p.image) return '/images/products/placeholder.svg';
        if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(p.image)) return p.image;
        // 拡張子なし → .jpg優先で補完
        return `${p.image}.jpg`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* ヘッダー */}
            <header className="bg-blue-500 dark:bg-blue-600 shadow-sm border-b border-blue-600 dark:border-blue-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold text-white">
                            オフィスコンビニ在庫管理
                        </h1>

                        {/* 検索（元の配置を維持） */}
                        <form
                            role="search"
                            aria-label="商品検索"
                            className="relative w-48 sm:w-64"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const q = new FormData(e.currentTarget).get('q')?.toString().trim();
                                if (!q) return;
                                console.log('search:', q);
                            }}
                        >
                            <input
                                type="search"
                                name="q"
                                placeholder="商品名で検索"
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/20 placeholder-white/70 text-white
                           focus:outline-none focus:ring-2 focus:ring-white/70 focus:bg-white/25
                           transition-colors text-sm"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/80"
                            >
                                🔍
                            </span>
                        </form>
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
                            <button
                                key={product.id}
                                type="button"
                                className="text-left"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {/* ProductTileにimageUrlを渡す */}
                                <ProductTile product={{ ...product, image: getImageUrl(product) }} />
                            </button>
                        ))}
                    </div>
                )}
            </main>

            {/* ✅ 商品詳細モーダル */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    imageUrl={getImageUrl(selectedProduct)}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

/** ✅ モーダル本体（同ファイルでも別ファイルでもOK） */
function ProductDetailModal({
    product,
    imageUrl,
    onClose,
}: {
    product: Product;
    imageUrl: string;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="商品詳細"
        >
            {/* 背景（クリックで閉じる） */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* パネル */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            商品詳細
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            aria-label="閉じる"
                        >
                            ✕
                        </button>
                    </div>

                    {/* 本文 */}
                    <div className="p-4 space-y-4">
                        {/* 画像 */}
                        <div className="mx-auto w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">画像がありません</div>
                            )}
                        </div>

                        {/* 名前 */}
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">商品名</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {product.name}
                            </div>
                        </div>

                        {/* 値段 */}
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">価格</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {/* price が number 前提（違うならここを調整） */}
                                {Number(product.price).toLocaleString()}円
                            </div>
                        </div>

                        {/* 下部ボタン（任意：今後「編集」「在庫増減」など追加しやすい） */}
                        <div className="pt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200
                           dark:bg-gray-700 dark:hover:bg-gray-600
                           text-gray-900 dark:text-gray-100 font-medium"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
``