import { useState, useEffect } from 'react';
import { ProductTile } from '../components/ProductTile';
import { CartButton } from '../components/CartButton';
import { getProducts, initializeSampleProducts } from '../services/productService';
import type { Product } from '../types/product';

export function OfficeConvenienceStore() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        if (!selectedProduct) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedProduct(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedProduct]);

    // 画像URL取得: 複数拡張子対応
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
            '/images/products/placeholder.svg'
        ];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-orange-500 dark:bg-orange-600 shadow-sm border-b border-orange-600 dark:border-orange-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Remixオフィスコンビニ
                            </h1>
                            <p className="text-sm text-orange-100 dark:text-orange-200 mt-1">
                                商品を選択して＋ボタンでカートに追加してください
                            </p>
                        </div>
                        <a
                            href="/"
                            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                        >
                            ← トップに戻る
                        </a>
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
                                <ProductTile product={product} getImageUrls={getImageUrls} />
                            </button>
                        ))}
                    </div>
                )}
            </main>

            <CartButton />
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    imageUrls={getImageUrls(selectedProduct)}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
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
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="商品詳細"
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
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
                    <div className="p-4 space-y-4">
                        <div className="mx-auto w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                                src={imageUrls[imgIdx]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={() => {
                                    if (imgIdx < imageUrls.length - 1) {
                                        setImgIdx(imgIdx + 1);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">商品名</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {product.name}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">価格</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {Number(product.price).toLocaleString()}円
                            </div>
                        </div>
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
