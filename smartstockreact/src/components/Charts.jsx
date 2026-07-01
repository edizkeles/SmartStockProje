import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, BarChart2 } from 'lucide-react';

export default function Charts() {
  const products = useSelector((state) => state.products.list);

  const catStats = {};
  products.forEach((u) => {
    const catName = u.kategori ? u.kategori.ad : 'Diğer';
    if (!catStats[catName]) {
      catStats[catName] = { count: 0, value: 0 };
    }
    catStats[catName].count += u.stok_miktari;
    catStats[catName].value += parseFloat(u.fiyat) * u.stok_miktari;
  });

  const categories = Object.keys(catStats);
  const totalCount = products.reduce((acc, u) => acc + u.stok_miktari, 0) || 1;
  const maxValue = Math.max(...categories.map((c) => catStats[c].value), 1);

  const colors = [
    'bg-indigo-600 dark:bg-indigo-500',
    'bg-emerald-600 dark:bg-emerald-500',
    'bg-amber-500 dark:bg-amber-400',
    'bg-rose-500 dark:bg-rose-400',
    'bg-sky-500 dark:bg-sky-400',
    'bg-violet-500 dark:bg-violet-400',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="card-theme p-5">
        <h5 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          <PieChart className="h-4 w-4" />
          Kategori Dağılımı (Stok Miktarı)
        </h5>
        <div className="space-y-3.5">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Kategori verisi bulunmuyor.</p>
          ) : (
            categories.map((cat, index) => {
              const count = catStats[cat].count;
              const pct = ((count / totalCount) * 100).toFixed(0);
              const colorClass = colors[index % colors.length];

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} {cat === "Gıda" ? "kg" : "Adet"} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="card-theme p-5">
        <h5 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          <BarChart2 className="h-4 w-4" />
          Kategori Değer Dağılımı (TL)
        </h5>
        <div className="space-y-3.5">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Kategori verisi bulunmuyor.</p>
          ) : (
            categories.map((cat, index) => {
              const value = catStats[cat].value;
              const pct = (value / maxValue) * 100;
              const colorClass = colors[index % colors.length];

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">
                      {value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
