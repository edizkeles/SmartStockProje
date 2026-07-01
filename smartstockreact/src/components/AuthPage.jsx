import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice';
import { Package, User, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.auth);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    setValidationError('');
    setUsername('');
    setPassword('');
  }, [isLoginMode, dispatch]);

  useEffect(() => {
    if (success) {
      setIsLoginMode(true);
      setUsername('');
      setPassword('');
    }
  }, [success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    if (!username.trim()) {
      setValidationError('Kullanıcı adı boş bırakılamaz.');
      return;
    }

    if (!password) {
      setValidationError('Şifre boş bırakılamaz.');
      return;
    }

    if (isLoginMode) {
      dispatch(loginUser({ username, password }));
    } else {
      if (username.trim().toLowerCase() === 'admin') {
        setValidationError('Bu kullanıcı adı ile kayıt olunamaz.');
        return;
      }
      dispatch(registerUser({ username, password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Package className="h-8 w-8 stroke-[2]" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              SmartStock
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {isLoginMode ? 'Kullanıcı girişi yapın' : 'Yeni kullanıcı hesabı oluşturun'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>

          {/* Error Message */}
          {(validationError || error) && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg mb-6 text-rose-700 text-xs">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && isLoginMode && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg mb-6 text-emerald-700 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Kayıt başarılı! Şimdi giriş yapabilirsiniz.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Kullanıcı adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Şifre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800"
            >
              {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-xs text-indigo-650 hover:text-indigo-800 font-semibold focus:outline-none transition-colors"
              >
                {isLoginMode ? 'Hesabınız yok mu? Kayıt olun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
