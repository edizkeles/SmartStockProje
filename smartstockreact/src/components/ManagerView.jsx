import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../store/slices/productSlice';
import { Edit2, Box, Trash2, FileSpreadsheet, Plus, Search } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import StockUpdateModal from './StockUpdateModal';

export default function ManagerView() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const loading = useSelector((state) => state.products.loading);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [productToUpdateStock, setProductToUpdateStock] = useState(null);

  const filteredProducts = products.filter((u) => {
    const matchesSearch = u.ad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || (u.kategori_id && u.kategori_id.toString() === filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        await dispatch(removeProduct(id)).unwrap();
        alert("Ürün başarıyla silindi.");
      } catch (err) {
        alert(err || "Silinirken hata oluştu.");
      }
    }
  };

  const handleExportCSV = () => {
    if (products.length === 0) {
      alert("Envanter listesi boş!");
      return;
    }

    const headers = ["ID", "Ürün Adı", "Kategori", "Ağırlık (Kg)", "Stok Miktarı (Adet)", "Fiyat (TL)", "Birim Fiyat (TL/Kg)"];
    
    const rows = products.map(u => [
      u.id,
      u.ad,
      u.kategori ? u.kategori.ad : "Diğer",
      u.agirlik,
      u.stok_miktari,
      u.fiyat,
      u.agirlik > 0 ? (parseFloat(u.fiyat) / u.agirlik).toFixed(2) : u.fiyat
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SmartStock_Envanter_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Envanter Listesi</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ürünlerinizi düzenleyin, stokları takip edin.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel'e Aktar (CSV)
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <div className="card-theme p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Ürün adı..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-theme !pl-10"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-theme"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="1">Elektronik</option>
          <option value="2">Gıda</option>
          <option value="3">Kozmetik</option>
          <option value="4">Kırtasiye</option>
        </select>
      </div>

      <div className="card-theme overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6">Ürün Bilgisi</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Stok Durumu</th>
                <th className="py-4 px-6 w-32">Fiyat</th>
                <th className="py-4 px-6 w-36 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">Yükleniyor...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">Envanterde ürün bulunamadı.</td>
                </tr>
              ) : (
                 filteredProducts.map((u) => {
                  const priceVal = parseFloat(u.fiyat) || 0;
                  const isCritical = u.stok_miktari < 5;

                  return (
                    <tr 
                      key={u.id} 
                      className={`transition-colors ${
                        isCritical 
                          ? 'bg-rose-50/60 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:hover:bg-rose-900/30' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-slate-500">{u.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 dark:text-white">{u.ad}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{u.kategori ? u.kategori.ad : 'Diğer'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {u.stok_miktari} {u.urun_tipi === "Gida" ? "kg" : "Adet"}
                        </div>
                        {isCritical && (
                          <span className="inline-block text-[9px] font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                            Kritik Stok!
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                        {priceVal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => {
                              setProductToEdit(u);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToUpdateStock(u);
                              setIsStockOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Stok Güncelle"
                          >
                            <Box className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={productToEdit}
      />

      <StockUpdateModal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        product={productToUpdateStock}
      />
    </div>
  );
}
