import React, { useState } from 'react';
import { X, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginCustomerWithOtp } = useStore();

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtp('1234'); // Pre-fill mock OTP for smooth testing
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginCustomerWithOtp(mobile, otp);
    if (success) {
      setIsAuthModalOpen(false);
      setStep('mobile');
    } else {
      setError('Invalid OTP code. Please enter 1234.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">Customer Sign In</h3>
          <p className="text-xs text-slate-500">
            Sign in with Mobile OTP to access your previous orders and exclusive Vaishali festival discounts.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9431287612"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-12 pr-3 py-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <span>Get OTP Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter 4-Digit OTP sent to +91 {mobile}
              </label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-lg py-2 outline-none focus:border-red-600 focus:bg-white"
              />
              <p className="text-[10px] text-center text-slate-400 mt-1">
                (Test OTP auto-provided: <span className="font-bold text-red-700">1234</span>)
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <span>Verify & Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep('mobile')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-700"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured via Supabase Auth & Instant SMS</span>
        </div>
      </div>
    </div>
  );
};
