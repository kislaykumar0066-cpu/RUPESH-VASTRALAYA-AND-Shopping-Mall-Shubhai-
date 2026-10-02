import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Navigation,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LOCAL_AREAS } from '../../lib/constants';

export const AdminDelivery: React.FC = () => {
  const { shopSettings, updateShopSettings, orders } = useStore();

  const [radius, setRadius] = useState(shopSettings.deliveryRadiusKm || 5.0);
  const [minOrder, setMinOrder] = useState(shopSettings.freeDeliveryMinOrder || 999);
  const [saved, setSaved] = useState(false);

  const riders = [
    { id: 'R-04', name: 'Rakesh Kumar', phone: '9431287102', zone: 'Rajendra Chowk & Anjanpir', status: 'ON_ROUTE', activeOrders: 2 },
    { id: 'R-09', name: 'Vikas Sah', phone: '9835012389', zone: 'Hajipur Industrial Area', status: 'AVAILABLE', activeOrders: 0 },
    { id: 'R-12', name: 'Manoj Singh', phone: '9122498231', zone: 'Shubhai Chowk Flagship', status: 'ON_ROUTE', activeOrders: 1 },
    { id: 'R-14', name: 'Deepak Jha', phone: '9931811200', zone: 'Lalganj Bypass Road', status: 'AVAILABLE', activeOrders: 0 },
  ];

  const handleSave = () => {
    updateShopSettings({
      deliveryRadiusKm: radius,
      freeDeliveryMinOrder: minOrder,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Local 5km Express Delivery Geo-Fencing & Rider Fleet</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store Center: {shopSettings.location} (Coordinates: {shopSettings.centerLat}° N, {shopSettings.centerLng}° E)
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#8b1515] hover:bg-red-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-colors cursor-pointer shrink-0"
        >
          {saved ? '✓ Rules Saved' : 'Save Geo Rules'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Geo Fence Controls */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Geo-Fence Parameters</h3>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Active Delivery Radius</span>
              <span className="text-red-700">{radius.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full accent-red-700"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs text-slate-800">Garment Delivery Policy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Within {radius} km:</strong> 100% FREE express 24-hr doorstep delivery for all garments.<br />
              • <strong>Outside {radius} km:</strong> Standard courier fee of ₹80 applies (3-5 business days).<br />
              • <strong>Future Grocery Items:</strong> Free on orders over ₹{minOrder}, else ₹40 fee.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2">Vaishali District Coverage Matrix</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {LOCAL_AREAS.map((area) => {
                const eligible = area.distanceKm <= radius;
                return (
                  <div
                    key={area.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs border border-slate-100"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{area.name}</span>
                      <span className="text-[10px] text-slate-400 block">PIN: {area.pincode} • {area.distanceKm} km</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        eligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {eligible ? '5km Eligible (Free)' : 'Courier Only'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rider Fleet Management */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Local Delivery Fleet (14 Active Riders)</h3>
            <span className="text-xs text-emerald-700 font-bold">4 Active in Shubhai</span>
          </div>

          <div className="space-y-3">
            {riders.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs">
                    {r.id}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <p className="text-[11px] text-slate-500">Zone: {r.zone}</p>
                    <p className="text-[10px] text-slate-400">Phone: +91 {r.phone}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      r.status === 'ON_ROUTE'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {r.status === 'ON_ROUTE' ? `🛵 On Delivery (${r.activeOrders})` : '✓ Available'}
                  </span>
                  <p className="text-[10px] text-slate-400">Avg 35m turnaround</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
