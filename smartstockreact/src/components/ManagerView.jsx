import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../store/slices/productSlice';
import { loadLogs, deleteLogs } from '../store/slices/purchaseLogSlice';
import { Edit2, Box, Trash2, FileSpreadsheet, Plus, Search, Clock, User, ClipboardList, Trash } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import StockUpdateModal from './StockUpdateModal';

export default function ManagerView() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const loading = useSelector((state) => state.products.loading);
  const purchaseLogs = useSelector((state) => state.purchaseLogs.logs);

  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    dispatch(loadLogs());
  }, [dispatch, activeTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('');
  const [logDateFilter, setLogDateFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [productToUpdateStock, setProductToUpdateStock] = useState(null);

  const filteredLogs = purchaseLogs.filter((log) => {
    // 1. Product Name filter
    let matchesSearch = true;
    if (logSearchTerm.trim()) {
      const term = logSearchTerm.toLowerCase();
      if (log.type === 'purchase') {
        matchesSearch = log.items.some(item => item.ad.toLowerCase().includes(term));
      } else if (log.type === 'stock_update') {
        matchesSearch = log.productName.toLowerCase().includes(term);
      } else if (log.type === 'product_mutate') {
        matchesSearch = log.productName.toLowerCase().includes(term);
      }
    }

    // 2. Log Type filter
    let matchesType = true;
    if (logTypeFilter) {
      if (logTypeFilter === 'purchase') {
        matchesType = log.type === 'purchase';
      } else if (logTypeFilter === 'stock_update') {
        matchesType = log.type === 'stock_update';
      } else if (logTypeFilter === 'product_add') {
        matchesType = log.type === 'product_mutate' && log.actionType === 'Ekleme';
      }
    }

    // 3. Date filter
    let matchesDate = true;
    if (logDateFilter) {
      const [year, month, day] = logDateFilter.split('-');
      const formattedFilterDate = `${day}.${month}.${year}`;
      matchesDate = log.timestamp.startsWith(formattedFilterDate);
    }

    return matchesSearch && matchesType && matchesDate;
  });

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
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <Box className="h-4 w-4" />
          Envanter Yönetimi
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Satış Kayıtları
          {purchaseLogs.length > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {purchaseLogs.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
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
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">İşlem Kayıtları</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Müşteri satın alımları ve ürün ekleme geçmişi.</p>
            </div>
            {purchaseLogs.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Tüm işlem kayıtlarını temizlemek istediğinize emin misiniz?")) {
                    dispatch(deleteLogs());
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash className="h-4 w-4" />
                Geçmişi Temizle
              </button>
            )}
          </div>

          {/* Logs Filter Bar */}
          <div className="card-theme p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Ürün adına göre ara..."
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                className="input-theme !pl-10"
              />
            </div>

            <select
              value={logTypeFilter}
              onChange={(e) => setLogTypeFilter(e.target.value)}
              className="input-theme"
            >
              <option value="">Tüm İşlem Türleri</option>
              <option value="purchase">Satın Alma</option>
              <option value="stock_update">Stok Güncelleme</option>
              <option value="product_add">Ürün Ekleme</option>
            </select>

            <input
              type="date"
              value={logDateFilter}
              onChange={(e) => setLogDateFilter(e.target.value)}
              className="input-theme"
            />
          </div>

          {filteredLogs.length === 0 ? (
            <div className="card-theme p-10 text-center text-slate-400 dark:text-slate-500">
              <ClipboardList className="h-10 w-10 mx-auto stroke-[1.5] mb-2 opacity-50" />
              <p className="text-sm font-semibold">Kayıtlı işlem bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                if (log.type === 'stock_update') {
                  const diff = log.newStock - log.oldStock;
                  const diffText = diff > 0 ? `+${diff}` : diff;
                  const diffColor = diff > 0 
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                    : diff < 0 
                      ? 'text-rose-600 dark:text-rose-400 font-bold' 
                      : 'text-slate-500 dark:text-slate-400 font-bold';

                  return (
                    <div key={log.id} className="card-theme p-5 space-y-4 bg-amber-50/10 dark:bg-amber-950/5">
                      {/* Log Header */}
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                            <User className="h-4 w-4 text-amber-500" />
                            <span>Kullanıcı:</span>
                            <span className="text-slate-900 dark:text-white font-bold ml-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {log.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full">
                          Stok Güncelleme
                        </span>
                      </div>

                      {/* Log Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-450 dark:text-slate-500 block mb-0.5 font-medium">Ürün Adı:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{log.productName}</span>
                        </div>
                        <div>
                          <span className="text-slate-455 dark:text-slate-500 block mb-0.5 font-medium">Eski Stok:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{log.oldStock} {log.unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-455 dark:text-slate-500 block mb-0.5 font-medium">Yeni Stok:</span>
                          <span className="font-bold text-slate-800 dark:text-white">{log.newStock} {log.unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-455 dark:text-slate-500 block mb-0.5 font-medium">Değişim:</span>
                          <span className={diffColor}>{diffText} {log.unit}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (log.type === 'product_mutate') {
                  return (
                    <div key={log.id} className="card-theme p-5 space-y-4 bg-emerald-50/10 dark:bg-emerald-950/5">
                      {/* Log Header */}
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                            <User className="h-4 w-4 text-emerald-500" />
                            <span>Kullanıcı:</span>
                            <span className="text-slate-900 dark:text-white font-bold ml-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {log.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                          Ürün Ekleme
                        </span>
                      </div>

                      {/* Log Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-450 dark:text-slate-500 block mb-0.5 font-medium">Ürün Adı:</span>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">{log.productName}</span>
                        </div>
                        <div>
                          <span className="text-slate-455 dark:text-slate-500 block mb-0.5 font-medium">Detaylar:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{log.details}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Default Purchase Log Rendering
                return (
                  <div key={log.id} className="card-theme p-5 space-y-4">
                    {/* Log Header */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                          <User className="h-4 w-4 text-indigo-500" />
                          <span>Kullanıcı:</span>
                          <span className="text-slate-900 dark:text-white font-bold ml-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {log.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="inline-block text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full mr-2">
                          Satın Alma
                        </span>
                        Toplam Tutar: <span className="text-indigo-600 dark:text-indigo-400 text-base">{log.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                      </div>
                    </div>

                    {/* Log Items list */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800/40 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <th className="py-2 px-4">Ürün Adı</th>
                            <th className="py-2 px-4 w-32 text-center">Birim Fiyat</th>
                            <th className="py-2 px-4 w-32 text-center">Miktar</th>
                            <th className="py-2 px-4 w-32 text-right">Toplam Fiyat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-850/20 text-xs text-slate-700 dark:text-slate-300">
                          {log.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                              <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-white">{item.ad}</td>
                              <td className="py-2.5 px-4 text-center">
                                {item.pricePerUnit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ {item.isWeightBased ? '/ Kg' : ''}
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold">
                                {item.isWeightBased ? `${item.quantity.toFixed(1)} kg` : `${item.quantity} Adet`}
                              </td>
                              <td className="py-2.5 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                                {(item.quantity * item.pricePerUnit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
