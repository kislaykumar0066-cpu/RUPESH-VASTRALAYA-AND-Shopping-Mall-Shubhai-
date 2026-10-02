import React, { useState } from 'react';
import { Users, Search, Phone, CheckCircle, MessageSquare, Star, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminCustomers: React.FC = () => {
  const { customers } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.locality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-700" />
            <span>Store Customer Directory ({customers.length} Registered)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track purchase lifetime value, localities, and WhatsApp marketing campaign consent.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, phone, town..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-red-600 w-56 sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name & Tag</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Locality (Hajipur / Vaishali)</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Last Purchase</th>
                <th className="py-3 px-4">WhatsApp Marketing Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      {c.isVip && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-300">
                          VIP BUYER
                        </span>
                      )}
                    </div>
                    {c.email && <span className="text-[10px] text-slate-400">{c.email}</span>}
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    +91 {c.mobile}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {c.locality}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {c.totalOrders} orders
                  </td>

                  <td className="py-3 px-4 font-black text-slate-900">
                    ₹{c.totalSpend.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {c.lastPurchaseDate}
                  </td>

                  <td className="py-3 px-4">
                    {c.whatsappMarketingOptIn ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Opted In (VIP Broadcast)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        Transactional Only
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
