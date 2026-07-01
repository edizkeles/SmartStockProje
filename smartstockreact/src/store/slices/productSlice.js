import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchProducts();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product, { dispatch, rejectWithValue }) => {
    try {
      const newProduct = await api.addProduct(product);
      dispatch(loadProducts());
      return newProduct;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, product }, { dispatch, rejectWithValue }) => {
    try {
      await api.updateProduct(id, product);
      dispatch(loadProducts());
      return { id, product };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.deleteProduct(id);
      dispatch(loadProducts());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeStock = createAsyncThunk(
  'products/changeStock',
  async ({ id, newStock }, { dispatch, rejectWithValue }) => {
    try {
      await api.updateStock(id, newStock);
      dispatch(loadProducts());
      return { id, newStock };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
