import { useState } from 'react';
import type { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';

interface ProductTileProps {
  product: Product;
}

// サポートする画像拡張子（優先順）
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.webp', '.png', '.gif'];

export function ProductTile({ product }: ProductTileProps) {
  const { addToCart } = useCart();
  const [currentExtIndex, setCurrentExtIndex] = useState(0);
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
  };

  // 画像パスの取得（フォールバック対応）
  const getImageSrc = () => {
    if (!product.image) return '/images/products/placeholder.svg';
    if (usePlaceholder) return '/images/products/placeholder.svg';
    // data:URLの場合はそのまま返す（旧データ対応）
    if (product.image.startsWith('data:')) return product.image;
    
    // 拡張子がある場合はそのまま返す
    const hasExtension = IMAGE_EXTENSIONS.some(ext => 
      product.image.toLowerCase().endsWith(ext)
    );
    if (hasExtension) return product.image;
    
    // 拡張子がない場合は現在の拡張子インデックスを使用
    return `${product.image}${IMAGE_EXTENSIONS[currentExtIndex]}`;
  };

  const handleImageError = () => {
    // 次の拡張子を試す
    if (currentExtIndex < IMAGE_EXTENSIONS.length - 1) {
      setCurrentExtIndex(prev => prev + 1);
    } else {
      // 全ての拡張子を試したらプレースホルダーを使用
      setUsePlaceholder(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={getImageSrc()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ¥{product.price.toLocaleString()}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`${product.name}をカートに追加`}
          >
            +
          </button>
        </div>
        
        {product.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}