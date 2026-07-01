import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const isWeightBased = product.urun_tipi === "Gida";
      const maxStock = parseFloat(product.stok_miktari) || 0;

      const existingIndex = state.items.findIndex(item => item.productId === product.id);
      if (existingIndex > -1) {
        let newQty = state.items[existingIndex].quantity + quantity;
        if (isWeightBased) {
          newQty = Math.round(newQty * 10) / 10;
        }
        if (newQty > maxStock) {
          alert(`Stok aşılıyor! Maksimum stok: ${product.stok_miktari}`);
          return;
        }
        state.items[existingIndex].quantity = newQty;
      } else {
        if (quantity > maxStock) {
          alert(`Yetersiz stok! En fazla ${product.stok_miktari} ekleyebilirsiniz.`);
          return;
        }
        state.items.push({
          productId: product.id,
          ad: product.ad,
          pricePerUnit: parseFloat(product.fiyat),
          weightPerUnit: parseFloat(product.agirlik),
          quantity: quantity,
          isWeightBased: isWeightBased,
          maxStock: maxStock
        });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    changeQuantity: (state, action) => {
      const { productId, change } = action.payload;
      const existing = state.items.find(item => item.productId === productId);
      if (existing) {
        let newQty = existing.quantity + change;
        if (existing.isWeightBased) {
          newQty = Math.round(newQty * 10) / 10;
        }

        if (newQty <= 0.05) {
          state.items = state.items.filter(item => item.productId !== productId);
        } else if (newQty > existing.maxStock) {
          alert(`Yetersiz stok! En fazla ${existing.maxStock} seçebilirsiniz.`);
        } else {
          existing.quantity = newQty;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, changeQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
