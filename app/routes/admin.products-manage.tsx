import { useState, useEffect } from "react";
import type { Product, Category } from "../types/product";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";

// サポートする画像拡張子（優先順）
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.webp', '.png', '.gif'];

// 拡張子自動検出付き画像コンポーネント
function ProductImage({ product, className }: { product: Product; className?: string }) {
  const [currentExtIndex, setCurrentExtIndex] = useState(0);
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  useEffect(() => {
    setCurrentExtIndex(0);
    setUsePlaceholder(false);
  }, [product.image]);

  const getImageSrc = () => {
    if (!product.image) return '/images/products/placeholder.svg';
    if (usePlaceholder) return '/images/products/placeholder.svg';
    if (product.image.startsWith('data:')) return product.image;
    
    const hasExtension = IMAGE_EXTENSIONS.some(ext => 
      product.image.toLowerCase().endsWith(ext)
    );
    if (hasExtension) return product.image;
    
    return `${product.image}${IMAGE_EXTENSIONS[currentExtIndex]}`;
  };

  const handleImageError = () => {
    if (currentExtIndex < IMAGE_EXTENSIONS.length - 1) {
      setCurrentExtIndex(prev => prev + 1);
    } else {
      setUsePlaceholder(true);
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt={product.name}
      className={className}
      onError={handleImageError}
    />
  );
}

// カテゴリ一覧（実際にはDBから取得）
const defaultCategories: Category[] = [
  { id: '1', name: '食品', icon: '🍱', displayOrder: 1 },
  { id: '2', name: '飲み物', icon: '🥤', displayOrder: 2 },
  { id: '3', name: 'お菓子', icon: '🍭', displayOrder: 3 },
  { id: '4', name: 'パン', icon: '🍞', displayOrder: 4 },
  { id: '5', name: 'おにぎり', icon: '🍙', displayOrder: 5 },
  { id: '6', name: '弁当', icon: '🍱', displayOrder: 6 },
  { id: '7', name: 'デザート', icon: '🍰', displayOrder: 7 },
  { id: '8', name: 'その他', icon: '📦', displayOrder: 99 },
];

export function meta() {
  return [
    { title: "商品管理 - Remixオフィスコンビニ" },
    { name: "description", content: "商品の追加・編集・在庫管理" },
  ];
}

interface ProductFormData {
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  tags: string[];
}

const emptyFormData: ProductFormData = {
  name: '',
  price: 0,
  image: '',
  description: '',
  category: '食品',
  stock: 0,
  tags: [],
};

export default function AdminProductsManage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
  const [newTag, setNewTag] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image || '',
      description: product.description || '',
      category: product.category || '食品',
      stock: product.stock || 0,
      tags: product.tags || [],
    });
    setIsEditing(false);
    setIsAdding(false);
    setMessage(null);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormData(emptyFormData);
    setIsAdding(true);
    setIsEditing(true);
    setMessage(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    if (isAdding) {
      setIsAdding(false);
      setSelectedProduct(null);
    }
    setIsEditing(false);
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image || '',
        description: selectedProduct.description || '',
        category: selectedProduct.category || '食品',
        stock: selectedProduct.stock || 0,
        tags: selectedProduct.tags || [],
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name || formData.price <= 0) {
        setMessage({ type: 'error', text: '商品名と価格は必須です' });
        return;
      }

      if (isAdding) {
        const newId = await addProduct({
          name: formData.name,
          price: formData.price,
          image: formData.image || '/images/products/placeholder.svg',
          description: formData.description,
          category: formData.category,
          stock: formData.stock,
        });
        setMessage({ type: 'success', text: '商品を追加しました' });
        setIsAdding(false);
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, {
          name: formData.name,
          price: formData.price,
          image: formData.image,
          description: formData.description,
          category: formData.category,
          stock: formData.stock,
        });
        setMessage({ type: 'success', text: '商品を更新しました' });
      }
      
      setIsEditing(false);
      await loadProducts();
    } catch (err) {
      console.error('保存に失敗しました:', err);
      setMessage({ type: 'error', text: '保存に失敗しました' });
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    if (!confirm(`「${selectedProduct.name}」を削除しますか？`)) return;

    try {
      await deleteProduct(selectedProduct.id);
      setMessage({ type: 'success', text: '商品を削除しました' });
      setSelectedProduct(null);
      setFormData(emptyFormData);
      await loadProducts();
    } catch (err) {
      console.error('削除に失敗しました:', err);
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // フィルタリングされた商品リスト
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-blue-600 dark:bg-blue-700 shadow-sm border-b border-blue-700 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">📦 商品管理</h1>
              <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                商品の追加・編集・在庫管理
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/admin/products"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                🖼️ 画像管理
              </a>
              <a
                href="/admin"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                ← 管理者メニューに戻る
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 商品リスト */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                商品一覧
              </h2>
              <button
                onClick={handleAddNew}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                ＋ 新規追加
              </button>
            </div>

            {/* 検索・フィルター */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="商品名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">すべてのカテゴリ</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 商品リスト */}
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ProductImage
                      product={product}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ¥{product.price} / 在庫: {product.stock ?? 0}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    商品が見つかりません
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 商品詳細・編集フォーム */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {selectedProduct || isAdding ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isAdding ? '新規商品追加' : '商品詳細'}
                  </h2>
                  <div className="flex gap-2">
                    {!isEditing && !isAdding && (
                      <>
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          ✏️ 編集
                        </button>
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                          🗑️ 削除
                        </button>
                      </>
                    )}
                    {isEditing && (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          💾 保存
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                          キャンセル
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* メッセージ */}
                {message && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* フォーム */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 左側: 基本情報 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        商品名 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        価格（円） *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        在庫数
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        カテゴリ
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        説明
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* 右側: 画像・タグ */}
                  <div className="space-y-4">
                    {/* 画像プレビュー */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        商品画像
                      </label>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                        {selectedProduct ? (
                          <ProductImage
                            product={{ ...selectedProduct, image: formData.image }}
                            className="w-48 h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="画像パス（例: /images/products/xxx.jpg）"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ※ 画像のアップロードは「画像管理」画面から行えます
                          </p>
                        </div>
                      )}
                    </div>

                    {/* タグ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        タグ
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                          >
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {formData.tags.length === 0 && (
                          <span className="text-gray-400 text-sm">タグなし</span>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="新しいタグを入力"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            追加
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">📦</div>
                <p>商品を選択するか、新規追加してください</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
