import { useState, useEffect } from "react";
import type { Product, Category, InventoryLot } from "../types/product";
import { getProducts, addProduct, updateProduct, deleteProduct, getInventoryLots, addInventoryLot, adjustInventoryLot, disposeInventoryLot } from "../services/productService";

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
  tags: string[];
}

const emptyFormData: ProductFormData = {
  name: '',
  price: 0,
  image: '',
  description: '',
  category: '食品',
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

  // 在庫ロット関連の状態
  const [inventoryLots, setInventoryLots] = useState<InventoryLot[]>([]);
  const [lotsLoading, setLotsLoading] = useState(false);
  const [showAddLotDialog, setShowAddLotDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [selectedLot, setSelectedLot] = useState<InventoryLot | null>(null);
  const [lotFormData, setLotFormData] = useState({ quantity: 0, expirationDate: '', lotNumber: '' });
  const [adjustFormData, setAdjustFormData] = useState({ newQuantity: 0, reason: '' });
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

  const loadInventoryLots = async (productId: string) => {
    try {
      setLotsLoading(true);
      const lots = await getInventoryLots(productId);
      setInventoryLots(lots);
    } catch (err) {
      console.error('在庫ロットの読み込みに失敗しました:', err);
      setInventoryLots([]);
    } finally {
      setLotsLoading(false);
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
      tags: product.tags || [],
    });
    setIsEditing(false);
    setIsAdding(false);
    setMessage(null);
    loadInventoryLots(product.id);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormData(emptyFormData);
    setInventoryLots([]);
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
        await addProduct({
          name: formData.name,
          price: formData.price,
          image: formData.image || '/images/products/placeholder.svg',
          description: formData.description,
          category: formData.category,
        });
        setMessage({ type: 'success', text: '商品を追加しました。在庫は「在庫追加」ボタンから登録してください。' });
        setIsAdding(false);
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, {
          name: formData.name,
          price: formData.price,
          image: formData.image,
          description: formData.description,
          category: formData.category,
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
    
    if (!confirm(`「${selectedProduct.name}」を削除しますか？関連する在庫ロットもすべて削除されます。`)) return;

    try {
      await deleteProduct(selectedProduct.id);
      setMessage({ type: 'success', text: '商品を削除しました' });
      setSelectedProduct(null);
      setFormData(emptyFormData);
      setInventoryLots([]);
      await loadProducts();
    } catch (err) {
      console.error('削除に失敗しました:', err);
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
  };

  // ========== 在庫ロット操作 ==========

  const handleOpenAddLotDialog = () => {
    setLotFormData({ quantity: 1, expirationDate: '', lotNumber: '' });
    setShowAddLotDialog(true);
  };

  const handleAddLot = async () => {
    if (!selectedProduct) return;
    if (lotFormData.quantity <= 0 || !lotFormData.expirationDate) {
      setMessage({ type: 'error', text: '数量と賞味期限は必須です' });
      return;
    }
    try {
      await addInventoryLot({
        productId: selectedProduct.id,
        quantity: lotFormData.quantity,
        expirationDate: lotFormData.expirationDate,
        lotNumber: lotFormData.lotNumber || undefined,
      });
      setMessage({ type: 'success', text: '在庫を追加しました' });
      setShowAddLotDialog(false);
      await loadInventoryLots(selectedProduct.id);
      await loadProducts(); // 合計在庫数を更新
    } catch (err) {
      console.error('在庫追加に失敗しました:', err);
      setMessage({ type: 'error', text: '在庫追加に失敗しました' });
    }
  };

  const handleOpenAdjustDialog = (lot: InventoryLot) => {
    setSelectedLot(lot);
    setAdjustFormData({ newQuantity: lot.quantity, reason: '' });
    setShowAdjustDialog(true);
  };

  const handleAdjustLot = async () => {
    if (!selectedLot || !selectedProduct) return;
    if (adjustFormData.newQuantity < 0) {
      setMessage({ type: 'error', text: '数量は0以上を入力してください' });
      return;
    }
    if (!adjustFormData.reason.trim()) {
      setMessage({ type: 'error', text: '調整理由を入力してください' });
      return;
    }
    try {
      await adjustInventoryLot(selectedLot.id, adjustFormData.newQuantity, adjustFormData.reason);
      setMessage({ type: 'success', text: '在庫数を調整しました' });
      setShowAdjustDialog(false);
      setSelectedLot(null);
      await loadInventoryLots(selectedProduct.id);
      await loadProducts();
    } catch (err) {
      console.error('在庫調整に失敗しました:', err);
      setMessage({ type: 'error', text: '在庫調整に失敗しました' });
    }
  };

  const handleDisposeLot = async (lot: InventoryLot) => {
    if (!selectedProduct) return;
    const reason = prompt(`ロット（期限: ${lot.expirationDate}）を廃棄する理由を入力してください`);
    if (reason === null) return; // キャンセル
    if (!reason.trim()) {
      setMessage({ type: 'error', text: '廃棄理由を入力してください' });
      return;
    }
    try {
      await disposeInventoryLot(lot.id, reason);
      setMessage({ type: 'success', text: 'ロットを廃棄しました' });
      await loadInventoryLots(selectedProduct.id);
      await loadProducts();
    } catch (err) {
      console.error('廃棄に失敗しました:', err);
      setMessage({ type: 'error', text: '廃棄に失敗しました' });
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

  // 賞味期限に応じた色を返す
  const getExpirationColor = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateStr);
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    if (diffDays <= 3) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    if (diffDays <= 7) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
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
                        在庫数（合計）
                      </label>
                      <div className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">
                        {selectedProduct?.stock ?? 0} 個
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ※ 在庫ロットの合計（直接編集不可）
                        </span>
                      </div>
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

            {/* 在庫ロット一覧セクション */}
            {selectedProduct && !isAdding && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📋 在庫ロット一覧
                  </h3>
                  <button
                    onClick={handleOpenAddLotDialog}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                  >
                    ＋ 在庫追加
                  </button>
                </div>

                {lotsLoading ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">読み込み中...</div>
                ) : inventoryLots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-3xl mb-2">📭</div>
                    <p>在庫ロットがありません</p>
                    <p className="text-sm mt-1">「在庫追加」ボタンから在庫を登録してください</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">ロット番号</th>
                          <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">残数</th>
                          <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">賞味期限</th>
                          <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">入荷日</th>
                          <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">状態</th>
                          <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">メモ</th>
                          <th className="text-center py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryLots.map(lot => (
                          <tr key={lot.id} className={`border-b border-gray-100 dark:border-gray-700 ${lot.status !== 'active' ? 'opacity-50' : ''}`}>
                            <td className="py-2 px-3 text-gray-900 dark:text-white">
                              {lot.lotNumber || '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-gray-900 dark:text-white">
                              {lot.quantity}
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getExpirationColor(lot.expirationDate)}`}>
                                {lot.expirationDate}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                              {lot.receivedAt ? new Date(lot.receivedAt).toLocaleDateString('ja-JP') : '-'}
                            </td>
                            <td className="py-2 px-3">
                              {lot.status === 'active' && (
                                <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">有効</span>
                              )}
                              {lot.status === 'expired' && (
                                <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-medium">期限切れ</span>
                              )}
                              {lot.status === 'disposed' && (
                                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium">廃棄済</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400 text-xs max-w-[120px] truncate" title={lot.note || ''}>
                              {lot.note || '-'}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {lot.status === 'active' && (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    onClick={() => handleOpenAdjustDialog(lot)}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-xs"
                                    title="数量調整"
                                  >
                                    調整
                                  </button>
                                  <button
                                    onClick={() => handleDisposeLot(lot)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                                    title="廃棄"
                                  >
                                    廃棄
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 在庫追加ダイアログ */}
          {showAddLotDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📦 在庫追加 - {selectedProduct?.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      数量 *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lotFormData.quantity}
                      onChange={(e) => setLotFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      賞味期限 *
                    </label>
                    <input
                      type="date"
                      value={lotFormData.expirationDate}
                      onChange={(e) => setLotFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ロット番号（任意）
                    </label>
                    <input
                      type="text"
                      value={lotFormData.lotNumber}
                      onChange={(e) => setLotFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
                      placeholder="例: LOT-20260212-001"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddLot}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setShowAddLotDialog(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 数量調整ダイアログ */}
          {showAdjustDialog && selectedLot && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔧 在庫数量調整
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ロット: {selectedLot.lotNumber || '-'} / 賞味期限: {selectedLot.expirationDate} / 現在数量: {selectedLot.quantity}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      新しい数量 *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={adjustFormData.newQuantity}
                      onChange={(e) => setAdjustFormData(prev => ({ ...prev, newQuantity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      調整理由 *
                    </label>
                    <textarea
                      value={adjustFormData.reason}
                      onChange={(e) => setAdjustFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="例: 棚卸差異のため調整"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAdjustLot}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    調整する
                  </button>
                  <button
                    onClick={() => { setShowAdjustDialog(false); setSelectedLot(null); }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
