import { useState, useEffect, useRef } from 'react';
import type { Product } from '../types/product';
import { getProducts } from '../services/productService';

export function ProductImageEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('商品の読み込みに失敗しました:', err);
      setMessage({ type: 'error', text: '商品の読み込みに失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setPreviewImage(null);
    setMessage(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（1MB以下）
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'ファイルサイズは1MB以下にしてください' });
      return;
    }

    // 画像形式チェック
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '画像ファイルを選択してください' });
      return;
    }

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedProduct || !fileInputRef.current?.files?.[0]) {
      setMessage({ type: 'error', text: '商品と画像を選択してください' });
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', selectedProduct.id);
    formData.append('productName', selectedProduct.name);

    try {
      setUploading(true);
      setMessage(null);

      const response = await fetch('/api/upload-product-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '画像のアップロードに失敗しました');
      }

      setMessage({ type: 'success', text: `画像をアップロードしました: ${result.imagePath}` });
      
      // 商品リストを更新
      await loadProducts();
      
      // 選択中の商品情報を更新
      const updatedProduct = products.find(p => p.id === selectedProduct.id);
      if (updatedProduct) {
        setSelectedProduct({ ...updatedProduct, image: result.imagePath });
      }
      
      // プレビューをクリア
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      console.error('アップロードエラー:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '画像のアップロードに失敗しました' });
    } finally {
      setUploading(false);
    }
  };

  const getImageSrc = (product: Product) => {
    if (!product.image) return '/images/products/placeholder.svg';
    // data:URLの場合はそのまま返す（旧データ対応）
    if (product.image.startsWith('data:')) return product.image;
    return product.image;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-blue-600 dark:bg-blue-700 shadow-sm border-b border-blue-700 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                商品画像管理
              </h1>
              <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                商品を選択して画像を追加・変更できます
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              ← ストアに戻る
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 商品リスト */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              商品一覧
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-colors text-left ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <img
                      src={getImageSrc(product)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ¥{product.price.toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.image && !product.image.startsWith('data:')
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {product.image && !product.image.startsWith('data:') ? '画像あり' : '未設定'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 画像編集エリア */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              画像編集
            </h2>

            {selectedProduct ? (
              <div className="space-y-6">
                {/* 選択中の商品 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">選択中の商品</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </p>
                </div>

                {/* 現在の画像 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    現在の画像
                  </p>
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={getImageSrc(selectedProduct)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">
                    パス: {selectedProduct.image || '未設定'}
                  </p>
                </div>

                {/* 新しい画像選択 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    新しい画像を選択
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      dark:file:bg-blue-900 dark:file:text-blue-200
                      hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                      cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    推奨: 正方形（1:1）、1MB以下、JPG/PNG/WebP形式
                  </p>
                </div>

                {/* プレビュー */}
                {previewImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      プレビュー
                    </p>
                    <div className="w-48 h-48 border-2 border-blue-500 rounded-lg overflow-hidden">
                      <img
                        src={previewImage}
                        alt="プレビュー"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* メッセージ */}
                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* アップロードボタン */}
                <button
                  onClick={handleUpload}
                  disabled={!previewImage || uploading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    !previewImage || uploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploading ? 'アップロード中...' : '画像をアップロード'}
                </button>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-4">📷</p>
                <p>左のリストから商品を選択してください</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
