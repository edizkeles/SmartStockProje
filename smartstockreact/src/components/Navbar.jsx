import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Package, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'customer':
        return 'Müşteri';
      default:
        return 'Kullanıcı';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-xl select-none">
            <Package className="h-6 w-6 stroke-[2.5]" />
            <span>SmartStock</span>
          </div>
          
          {/* Profile & Logout */}
          <div className="flex items-center gap-6">
            {currentUser && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {currentUser.username}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block leading-none">
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(logout())}
                  title="Çıkış Yap"
                  className="flex items-center justify-center h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
