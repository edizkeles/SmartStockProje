import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, Info } from 'lucide-react';
import CartPanel from './CartPanel';

export default function CustomerView() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const loading = useSelector((state) => state.products.loading);

  const [cardQuantities, setCardQuantities] = useState({});

  const filteredProducts = products;

  const handleQtyChange = (productId, val) => {
    setCardQuantities({
      ...cardQuantities,
      [productId]: val
    });
  };

  const handleAddToCart = (product) => {
    const isWeightBased = product.urun_tipi === "Gida";
    const defaultQty = isWeightBased ? 1.0 : 1;
    const inputVal = cardQuantities[product.id];
    
    const qty = parseFloat(inputVal !== undefined ? inputVal : defaultQty) || 0;
    const maxStock = parseFloat(product.stok_miktari) || 0;

    if (qty <= 0.01 || qty > maxStock) {
      alert("Geçersiz miktar veya yetersiz stok!");
      return;
    }

    dispatch(addToCart({ product, quantity: qty }));
    
    setCardQuantities({
      ...cardQuantities,
      [product.id]: isWeightBased ? "1.0" : "1"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Ürün Kataloğu</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ürünlerinizi sepetinize ekleyip sipariş oluşturun.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-10">Yükleniyor...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="card-theme p-10 text-center text-slate-400 dark:text-slate-500">
            <Info className="h-10 w-10 mx-auto stroke-[1.5] mb-2 opacity-50" />
            <p className="text-sm font-semibold">Katalogda ürün bulunamadı.</p>
          </div>
                ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((u) => {
              const isOutOfStock = u.stok_miktari <= 0.01;
              const isWeightBased = u.urun_tipi === "Gida";
              const priceVal = parseFloat(u.fiyat) || 0;

              const priceText = isWeightBased 
                ? priceVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺ / Kg"
                : priceVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";

              const unitLabel = isWeightBased ? "Kilo (Kg):" : "Adet:";
              const qtyStep = isWeightBased ? "0.1" : "1";
              const qtyMin = isWeightBased ? "0.1" : "1";
              const qtyVal = cardQuantities[u.id] !== undefined ? cardQuantities[u.id] : (isWeightBased ? "1.0" : "1");

              return (
                <div key={u.id} className="card-theme p-5 flex flex-col justify-between h-full hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1">{u.ad}</h4>
                        <span className="inline-block text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full mt-2">
                          {u.kategori ? u.kategori.ad : "Genel"}
                        </span>
                      </div>
                      {isOutOfStock && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                          Tükendi
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800/40 pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Birim Fiyat:</span>
                      <span className="font-semibold text-slate-800 dark:text-white text-sm">{priceText}</span>
                    </div>

                    {isOutOfStock ? (
                      <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-xs font-semibold cursor-not-allowed" disabled>
                        Stokta Yok
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{unitLabel}</label>
                          <input
                            type="number"
                            min={qtyMin}
                            max={u.stok_miktari}
                            step={qtyStep}
                            value={qtyVal}
                            onChange={(e) => handleQtyChange(u.id, e.target.value)}
                            className="input-theme py-1 text-center"
                          />
                        </div>
                        <button
                          onClick={() => handleAddToCart(u)}
                          className="w-full btn-primary-theme flex items-center justify-center gap-1.5 py-2 font-semibold text-xs"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Sepete Ekle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <CartPanel />
      </div>
    </div>
  );
}
