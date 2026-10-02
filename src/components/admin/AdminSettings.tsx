import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Building,
  MapPin,
  Phone,
  Radio,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { shopSettings, updateShopSettings, setIsUpgradeModalOpen } = useStore();

  const [name, setName] = useState(shopSettings.name);
  const [location, setLocation] = useState(shopSettings.location);
  const [gstin, setGstin] = useState(shopSettings.gstin);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [whatsapp, setWhatsapp] = useState(shopSettings.whatsapp);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      name,
      location,
      gstin,
      phone,
      whatsapp,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-700" />
          <span>Shop & SaaS Subscription Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure physical store details, GST invoicing credentials, and monthly multitenant SaaS subscription plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Store Profile Form */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Retailer Identity & Legal Setup</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Showroom / Retailer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Physical Store Address & Landmark
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  GSTIN (For Invoicing)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                WhatsApp Business Automation Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#b91c1c] hover:bg-red-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Settings</span>
              </button>
              {saved && (
                <span className="text-xs text-emerald-700 font-bold">
                  ✓ Settings saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right: SaaS Subscription & Razorpay Plan */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">SaaS Monthly Subscription Architecture</h3>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-red-950">
                  {shopSettings.subscriptionPlan === 'TRIAL'
                    ? '7-Day Free Trial Tier'
                    : 'Pro Monthly Plan Active'}
                </span>
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                  {shopSettings.trialDaysRemaining} days remaining
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Includes automated WhatsApp broadcasts, 5km local geo-fenced delivery routing,
                and inventory liquidation engine.
              </p>
              <div className="pt-2 border-t border-red-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600">Standard Retailer Price:</span>
                <span className="font-black text-slate-900 text-sm">₹2,999 / month</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <p className="font-bold text-slate-800">Next Billing Renewal</p>
              <p>October 06, 2026 via Razorpay Subscriptions</p>
              <p className="text-[11px] text-slate-400">
                Webhook verified server-side. Auto-blocks order creation if trial expires without deleting records.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full bg-[#8b1515] hover:bg-red-900 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Upgrade to Paid Subscription @ ₹2,999/mo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
