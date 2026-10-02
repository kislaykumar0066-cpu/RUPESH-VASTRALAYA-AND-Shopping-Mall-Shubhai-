import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginViewProps {
  inactivityNotice?: boolean;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ inactivityNotice }) => {
  const { setCurrentView, loginAdmin, shopSettings } = useStore();

  const [authMethod, setAuthMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('admin@rupeshvastralaya.com');
  const [password, setPassword] = useState('admin123');
  const [mobile, setMobile] = useState('6206875074');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = loginAdmin(email, password);
      if (!success) {
        setError('Invalid credentials. Use demo: admin@rupeshvastralaya.com / admin123');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit registered mobile number');
      return;
    }
    setError('');
    setOtp('1234');
    setOtpSent(true);
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = loginAdmin(mobile, otp);
      if (!success) {
        setError('Invalid OTP code. Use demo OTP: 1234');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin@rupeshvastralaya.com', 'admin123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Background Indian ornamental tint */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b91c1c_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-md w-full relative z-10 space-y-4">
        {/* Inactivity Notice Banner if logged out after 15 minutes */}
        {inactivityNotice && (
          <div className="p-3 bg-amber-950/90 border border-amber-600 rounded-xl text-amber-200 text-xs flex items-center gap-2.5 shadow-lg animate-pulse">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Session Timed Out (15 Minutes Inactive)</p>
              <p className="text-[11px] text-amber-300">
                You were automatically signed out for security. Please sign in again.
              </p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-5">
          {/* Logo & Header */}
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 bg-gradient-to-tr from-red-800 to-amber-600 text-white font-black text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-lg border-2 border-amber-300">
              RV
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Merchant Admin Portal
            </h1>
            <p className="text-xs text-slate-500">
              {shopSettings.name} • Shubhai Chowk, Hajipur
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                <ShieldCheck className="w-3 h-3 text-red-700" />
                Authorized Access Required
              </span>
            </div>
          </div>

          {/* Toggle Email vs Mobile OTP */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                authMethod === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                authMethod === 'otp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mobile OTP Login
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form: Email & Password */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rupeshvastralaya.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Secret Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Demo credentials prefilled: <span className="font-mono text-slate-600">admin@rupeshvastralaya.com / admin123</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Verifying Admin Token...' : 'Sign In to Store Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form: Mobile OTP */}
          {authMethod === 'otp' && (
            <div className="space-y-3.5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Shopkeeper Registered Mobile
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="6206875074"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-3 py-2 text-xs outline-none focus:border-red-600 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>Get Admin OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpLogin} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Enter 4-Digit Security OTP
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-xl py-2 outline-none focus:border-red-600"
                    />
                    <p className="text-[10px] text-center text-slate-400 mt-1">
                      (Test OTP: <strong className="text-red-700">1234</strong>)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP & Enter Console'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick 1-Click Demo Login */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Demo Admin Sign In</span>
            </button>
          </div>

          {/* Return to Customer Storefront */}
          <div className="text-center pt-1">
            <button
              onClick={() => setCurrentView('storefront')}
              className="text-xs font-semibold text-slate-500 hover:text-red-700 inline-flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>← Return to Customer Storefront</span>
            </button>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Security Policy: Active sessions automatically lock after 15 minutes of inactivity.</span>
        </p>
      </div>
    </div>
  );
};
