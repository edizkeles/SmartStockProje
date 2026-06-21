import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, editProduct } from '../store/slices/productSlice';
import { X } from 'lucide-react';

export default function ProductFormModal({ isOpen, onClose, productToEdit }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ad: '',
    barkod: '',
    urun_tipi: '',
    kategori_id: '',
    stok_miktari: '',
    fiyat: '',
    agirlik: '',
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ad: productToEdit.ad || '',
        barkod: productToEdit.barkod || '',
        urun_tipi: productToEdit.urun_tipi || '',
        kategori_id: productToEdit.kategori_id || '',
        stok_miktari: productToEdit.stok_miktari || '',
        fiyat: productToEdit.fiyat || '',
        agirlik: productToEdit.agirlik || '',
      });
    } else {
      setFormData({
        ad: '',
        barkod: '',
        urun_tipi: '',
        kategori_id: '',
        stok_miktari: '',
        fiyat: '',
        agirlik: '',
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ad = formData.ad.trim();
    const barkod = formData.barkod.trim() || Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const stok_miktari = parseFloat(formData.stok_miktari);
    const fiyat = parseFloat(formData.fiyat);
    const agirlik = 1.0;
    const kategori_id = parseInt(formData.kategori_id);
    const urun_tipi = formData.urun_tipi;

    if (!ad || isNaN(stok_miktari) || isNaN(fiyat) || isNaN(agirlik) || agirlik <= 0 || isNaN(kategori_id) || !urun_tipi) {
      alert("Lütfen tüm alanları geçerli değerlerle doldurun.");
      return;
    }

    const payload = {
      ad,
      barkod,
      stok_miktari,
      fiyat,
      agirlik,
      kategori_id,
      urun_tipi
    };

    try {
      if (productToEdit) {
        await dispatch(editProduct({ id: productToEdit.id, product: payload })).unwrap();
        alert("Ürün başarıyla güncellendi.");
      } else {
        await dispatch(createProduct(payload)).unwrap();
        alert("Ürün başarıyla eklendi.");
      }
      onClose();
    } catch (err) {
      alert(err || "İşlem sırasında hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {productToEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Ürün Adı</label>
            <input
              type="text"
              required
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              className="input-theme"
              placeholder="Örn: Elma"
            />
          </div>



          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              required
              value={formData.kategori_id}
              onChange={(e) => {
                const catId = e.target.value;
                const utype = catId === "2" ? "Gida" : "Elektronik";
                setFormData({ ...formData, kategori_id: catId, urun_tipi: utype });
              }}
              className="input-theme"
            >
              <option value="">Seçin</option>
              <option value="1">Elektronik</option>
              <option value="2">Gıda</option>
              <option value="3">Kozmetik</option>
              <option value="4">Kırtasiye</option>
            </select>
          </div>

          {formData.urun_tipi === 'Gida' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Stok Ağırlığı (Kg)</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="any"
                  value={formData.stok_miktari}
                  onChange={(e) => setFormData({ ...formData, stok_miktari: e.target.value })}
                  className="input-theme"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Birim Fiyat (TL/Kg)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.fiyat}
                  onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                  className="input-theme"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Stok (Adet)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.stok_miktari}
                  onChange={(e) => setFormData({ ...formData, stok_miktari: e.target.value })}
                  className="input-theme"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Fiyat (TL)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.fiyat}
                  onChange={(e) => setFormData({ ...formData, fiyat: e.target.value })}
                  className="input-theme"
                />
              </div>
            </div>
          )}


          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary-theme">
              İptal
            </button>
            <button type="submit" className="btn-primary-theme">
              {productToEdit ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
