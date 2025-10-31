import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { CartDialog } from './CartDialog';

export function CartButton() {
  const { cart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenDialog}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="カートを表示"
        >
          <div className="relative">
            {/* カートアイコン */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m7.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m7.5 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h7.5z" />
            </svg>
            
            {/* 商品数のバッジ */}
            {cart.totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </div>
            )}
          </div>
        </button>
      </div>

      <CartDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}