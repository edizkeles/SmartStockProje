import React from 'react';
import { useSelector } from 'react-redux';
import { Layers, Coins } from 'lucide-react';

export default function Statistics() {
  const products = useSelector((state) => state.products.list);

  const totalProducts = products.length;
  const totalValue = products.reduce((acc, u) => acc + (parseFloat(u.fiyat) * u.stok_miktari), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="card-theme p-5 flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Toplam Ürün</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalProducts}</h3>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Layers className="h-6 w-6" />
        </div>
      </div>

      <div className="card-theme p-5 flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Toplam Envanter Değeri</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
          </h3>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <Coins className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
