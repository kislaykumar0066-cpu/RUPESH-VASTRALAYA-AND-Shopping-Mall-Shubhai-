import React, { useState } from 'react';
import {
  ShieldAlert,
  Building,
  Store,
  Users,
  CreditCard,
  Plus,
  CheckCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SuperAdminView: React.FC = () => {
  const { setCurrentView, shopSettings } = useStore();

  const [tenants, setTenants] = useState([
    {
      id: 'shop-01',
      name: 'Rupesh Vastralaya & Shopping Mall',
      owner: 'Rupesh Kumar',
      phone: '6206875074',
      location: 'Shubhai Chowk, Hajipur, Vaishali',
      plan: 'TRIAL',
      trialEnds: 'In 4 Days',
      status: 'ACTIVE',
      monthlyFee: '₹2,999',
      ordersCount: 142,
    },
    {
      id: 'shop-02',
      name: 'Maa Vaishno Garments',
      owner: 'Sanjay Gupta',
      phone: '9835019283',
      location: 'Cinema Road, Hajipur',
      plan: 'PRO_MONTHLY',
      trialEnds: 'Subscribed',
      status: 'ACTIVE',
      monthlyFee: '₹2,999',
      ordersCount: 89,
    },
    {
      id: 'shop-03',
      name: 'Mithila Silk & Saree Emporium',
      owner: 'Anil Mishra',
      phone: '9431209384',
      location: 'Muzaffarpur Bazaar, Bihar',
      plan: 'TRIAL',
      trialEnds: 'In 1 Day',
      status: 'ACTIVE',
      monthlyFee: '₹2,999',
      ordersCount: 45,
    },
    {
      id: 'shop-04',
      name: 'Shree Krishna Vastralaya',
      owner: 'Gopal Sah',
      phone: '9931844210',
      location: 'Mahua Bazaar, Vaishali',
      plan: 'EXPIRED',
      trialEnds: 'Expired',
      status: 'SUSPENDED',
      monthlyFee: '₹2,999',
      ordersCount: 12,
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Restricted SaaS Route: /super-admin
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Bharat Retail Multitenant SaaS Administration
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Super-admin panel for provisioning local shops, monitoring 7-day trials, and collecting monthly ₹2,999 subscriptions.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('admin')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Rupesh Store Admin</span>
            </button>
            <button
              onClick={() => setCurrentView('storefront')}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Customer Storefront</span>
            </button>
          </div>
        </div>

        {/* Global SaaS Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Total Retailer Tenants</span>
            <div className="text-2xl font-black text-white mt-1">4 Stores</div>
            <span className="text-[10px] text-emerald-400 font-bold">3 Active in North Bihar</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Monthly SaaS ARR</span>
            <div className="text-2xl font-black text-amber-400 mt-1">₹11,996</div>
            <span className="text-[10px] text-slate-400">@ ₹2,999/mo per shop</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">WhatsApp Broadcasts Sent</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">1,840</div>
            <span className="text-[10px] text-slate-400">Across all tenant shops</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Trial Conversion Rate</span>
            <div className="text-2xl font-black text-purple-400 mt-1">75%</div>
            <span className="text-[10px] text-emerald-400">High local retention</span>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Onboarded Retailer Tenants</h3>
            <button
              onClick={() => alert('New retail shop onboarding wizard: creates shops record with default 7-day trial.')}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard New Retailer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Shop Name & Location</th>
                  <th className="py-3 px-4">Proprietor & Phone</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Trial / Billing Status</th>
                  <th className="py-3 px-4">Tenant Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-[11px] text-slate-400">{t.location}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{t.owner}</p>
                      <p className="text-[11px] text-slate-400 font-mono">+91 {t.phone}</p>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {t.plan} ({t.monthlyFee}/mo)
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-300">{t.trialEnds}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          t.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setCurrentView('admin')}
                        className="text-red-400 hover:text-red-300 font-bold hover:underline"
                      >
                        Impersonate Admin →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
