import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from './store/slices/productSlice';
import { setView } from './store/slices/uiSlice';
import Navbar from './components/Navbar';
import Statistics from './components/Statistics';
import ManagerView from './components/ManagerView';
import CustomerView from './components/CustomerView';
import AuthPage from './components/AuthPage';

export default function App() {
  const dispatch = useDispatch();
  const currentView = useSelector((state) => state.ui.currentView);
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadProducts());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'admin') {
        dispatch(setView('manager'));
      } else {
        dispatch(setView('customer'));
      }
    }
  }, [isAuthenticated, currentUser, dispatch]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'admin' ? (
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
