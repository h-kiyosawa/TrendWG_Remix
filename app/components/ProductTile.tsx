import type { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';

interface ProductTileProps {
  product: Product;
}

export function ProductTile({ product }: ProductTileProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
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