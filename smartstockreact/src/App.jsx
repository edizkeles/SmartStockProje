import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from './store/slices/productSlice';
import Navbar from './components/Navbar';
import Statistics from './components/Statistics';
import ManagerView from './components/ManagerView';
import CustomerView from './components/CustomerView';

export default function App() {
  const dispatch = useDispatch();
  const currentView = useSelector((state) => state.ui.currentView);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'manager' ? (
          <div className="space-y-6">
            <Statistics />
            <ManagerView />
          </div>
        ) : (
          <CustomerView />
        )}
      </main>
    </div>
  );
}
