import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLogsApi, addPurchaseLogApi, addStockUpdateLogApi, addProductMutationLogApi, clearLogsApi } from '../../services/api';

export const loadLogs = createAsyncThunk(
  'purchaseLogs/loadLogs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchLogsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Kayıtlar yüklenemedi.');
    }
  }
);

export const savePurchaseLog = createAsyncThunk(
  'purchaseLogs/savePurchaseLog',
  async (logData, { rejectWithValue, dispatch }) => {
    try {
      const data = await addPurchaseLogApi(logData);
      dispatch(loadLogs()); // reload list
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Satış kaydı oluşturulamadı.');
    }
  }
);

export const saveStockUpdateLog = createAsyncThunk(
  'purchaseLogs/saveStockUpdateLog',
  async (logData, { rejectWithValue, dispatch }) => {
    try {
      const data = await addStockUpdateLogApi(logData);
      dispatch(loadLogs()); // reload list
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Stok güncelleme kaydı oluşturulamadı.');
    }
  }
);

export const saveProductMutationLog = createAsyncThunk(
  'purchaseLogs/saveProductMutationLog',
  async (logData, { rejectWithValue, dispatch }) => {
    try {
      const data = await addProductMutationLogApi(logData);
      dispatch(loadLogs()); // reload list
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Ürün kayıt işlemi başarısız.');
    }
  }
);

export const deleteLogs = createAsyncThunk(
  'purchaseLogs/deleteLogs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearLogsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Kayıtlar temizlenemedi.');
    }
  }
);

const initialState = {
  logs: [],
  loading: false,
  error: null
};

const purchaseLogSlice = createSlice({
  name: 'purchaseLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load Logs
      .addCase(loadLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(loadLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Logs
      .addCase(deleteLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLogs.fulfilled, (state) => {
        state.loading = false;
        state.logs = [];
      })
      .addCase(deleteLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default purchaseLogSlice.reducer;
