import { createSlice } from '@reduxjs/toolkit';

document.documentElement.classList.remove('dark');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentView: 'manager',
    theme: 'light',
  },
  reducers: {
    setView: (state, action) => {
      state.currentView = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  }
});

export const { setView, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
