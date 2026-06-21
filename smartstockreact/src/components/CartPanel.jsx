import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { changeStock } from '../store/slices/productSlice';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';

export default function CartPanel() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.list);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const grandTotalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.pricePerUnit, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      for (const item of cartItems) {
        const product = products.find((u) => u.id === item.productId);
        if (product) {
          const remainingStock = product.stok_miktari - item.quantity;
          await dispatch(changeStock({ id: item.productId, newStock: remainingStock })).unwrap();
        }
      }

      alert("Satın alma işlemi başarıyla tamamlandı!");
      dispatch(clearCart());
    } catch (err) {
      alert("Hata oluştu: " + (err.message || err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="card-theme p-5 sticky top-24">
      <h5 className="flex items-center justify-between text-sm font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Alışveriş Sepetim
        </span>
      </h5>

      <div className="space-y-4 max-h-[350px] overflow-y-auto mb-4 pr-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <ShoppingBag className="h-8 w-8 mx-auto stroke-[1.5] mb-2 opacity-50" />
            <p className="text-xs font-medium">Sepetiniz boş.</p>
          </div>
        ) : (
          cartItems.map((item) => {
            const itemTotalPrice = item.quantity * item.pricePerUnit;
            const qtyText = item.isWeightBased ? `${item.quantity.toFixed(1)} kg` : `${item.quantity} Adet`;
            const detailText = item.isWeightBased ? `${item.pricePerUnit.toFixed(2)} ₺ / Kg` : `${item.pricePerUnit.toFixed(2)} ₺ / Adet`;
            const stepVal = item.isWeightBased ? 0.1 : 1;

            return (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/40 last:border-0">
                <div className="flex-grow min-w-0 pr-2">
                  <h6 className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.ad}</h6>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {qtyText} ({detailText})
                  </p>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {itemTotalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => dispatch(changeQuantity({ productId: item.productId, change: -stepVal }))}
                    className="p-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold w-9 text-center text-slate-800 dark:text-white">
                    {item.isWeightBased ? item.quantity.toFixed(1) : item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(changeQuantity({ productId: item.productId, change: stepVal }))}
                    className="p-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="p-1.5 ml-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Tutar</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white">
            {grandTotalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || checkoutLoading}
        className="w-full btn-primary-theme flex items-center justify-center gap-2 py-2.5 font-semibold text-xs uppercase tracking-wider"
      >
        {checkoutLoading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Sepeti Onayla & Satın Al
      </button>
    </div>
  );
}
