import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeStock } from '../store/slices/productSlice';
import { X, Minus, Plus } from 'lucide-react';

export default function StockUpdateModal({ isOpen, onClose, product }) {
  const dispatch = useDispatch();
  const [stockVal, setStockVal] = useState(0);

  useEffect(() => {
    if (product) {
      setStockVal(product.stok_miktari || 0);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNaN(stockVal) || stockVal < 0) {
      alert("Geçersiz stok miktarı!");
      return;
    }

    try {
      await dispatch(changeStock({ id: product.id, newStock: parseFloat(stockVal) })).unwrap();
      alert("Stok başarıyla güncellendi.");
      onClose();
    } catch (err) {
      alert(err || "Stok güncellenirken hata oluştu.");
    }
  };

  const adjustStock = (amount) => {
    setStockVal((prev) => {
      const next = parseFloat(prev) + amount;
      return next < 0 ? 0 : Math.round(next * 10) / 10;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Stok Güncelle</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 text-center space-y-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {product.ad} için yeni stok değerini girin.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => adjustStock(-1)}
              className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={stockVal}
              onChange={(e) => setStockVal(e.target.value)}
              className="input-theme text-center font-bold text-lg w-28"
            />
            <button
              type="button"
              onClick={() => adjustStock(1)}
              className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-center gap-1.5 flex-wrap pt-2">
            {[-10, -5, +5, +10].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => adjustStock(amt)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md"
              >
                {amt > 0 ? `+${amt}` : amt}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary-theme w-1/2">
              İptal
            </button>
            <button type="submit" className="btn-primary-theme w-1/2">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
