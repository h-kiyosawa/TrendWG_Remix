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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" />
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