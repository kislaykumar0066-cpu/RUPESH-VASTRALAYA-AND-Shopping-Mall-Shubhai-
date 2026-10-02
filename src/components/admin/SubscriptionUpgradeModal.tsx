import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SubscriptionUpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeSubscription, shopSettings } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handlePaySubscription = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    await upgradeSubscription('PRO_MONTHLY');
    setIsProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsUpgradeModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">
            Upgrade to Retailer Pro Monthly Plan
          </h3>
          <p className="text-xs text-slate-500">
            Retain automated WhatsApp broadcast engine, 5km local geo-fencing, and multitenant e-commerce shop.
          </p>
        </div>

        {/* Pricing card */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
            Recommended for Local Retailers
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-slate-900">₹2,999</span>
            <span className="text-xs text-slate-500 font-semibold">/ month</span>
          </div>
          <p className="text-xs text-emerald-800 font-bold">
            Zero Commission on Store Orders • 100% Direct UPI & COD Settlements
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automated WhatsApp Order Invoices & Customer Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Old Stock Liquidation Engine & Targeted VIP Broadcasts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>5km Local Delivery Radius Geo-Fencing & Rider Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>GST-Compliant Billing & Multitenant Scalability</span>
          </div>
        </div>

        {success ? (
          <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl text-center">
            ✓ Subscription Activated! 30-day Pro Billing cycle initialized.
          </div>
        ) : (
          <button
            onClick={handlePaySubscription}
            disabled={isProcessing}
            className="w-full bg-[#8b1515] hover:bg-red-900 text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {isProcessing ? 'Connecting Razorpay Subscriptions...' : 'Pay ₹2,999 with Razorpay'}
            </span>
          </button>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with Razorpay Recurring Billing • Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
};
