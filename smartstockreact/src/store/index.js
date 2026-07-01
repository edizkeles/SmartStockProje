import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import purchaseLogReducer from './slices/purchaseLogSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    ui: uiReducer,
    auth: authReducer,
    purchaseLogs: purchaseLogReducer,
  },
});
