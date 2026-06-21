import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setView } from '../store/slices/uiSlice';
import { Package, Settings, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.ui);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl cursor-pointer" onClick={() => dispatch(setView('manager'))}>
            <Package className="h-6 w-6 stroke-[2.5]" />
            <span>SmartStock</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="inline-flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => dispatch(setView('manager'))}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'manager'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Yönetici
              </button>
              <button
                onClick={() => dispatch(setView('customer'))}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'customer'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Satın Alma
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
