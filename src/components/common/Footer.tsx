import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, shopSettings } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-red-700">
      <div className="container mx-auto px-4">
        {/* Value Propositions / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">5 km Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free 24-hr delivery in Shubhai & Hajipur</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Garments</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct handloom & certified fabrics</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Exchange Policy</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free size swap at store</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-950/80 border border-green-800 flex items-center justify-center text-green-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">WhatsApp Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant assistance on +91 6206875074</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-red-700 text-white font-black flex items-center justify-center text-sm border border-amber-400">
                RV
              </div>
              <h3 className="font-black text-white text-base tracking-tight">Rupesh Vastralaya</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your premier destination in Hajipur for Banarasi sarees, wedding attire, ladies kurtis,
              designer bridal wear, gents shirts, kurtas, and kids clothing.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GSTIN: {shopSettings.gstin}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Popular Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#saree" className="hover:text-amber-400 transition-colors">Banarasi Katan Silk Sarees</a></li>
              <li><a href="#kurti" className="hover:text-amber-400 transition-colors">Chanderi Gotta Patti Kurtis</a></li>
              <li><a href="#bridal" className="hover:text-amber-400 transition-colors">Heavy Bridal Georgette Sarees</a></li>
              <li><a href="#gents" className="hover:text-amber-400 transition-colors">Men's Jacquard Kurta-Pyjamas</a></li>
              <li><a href="#kids" className="hover:text-amber-400 transition-colors">Kids Festive Indo-Western Wear</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Shop Address & Hours</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Shubhai Chowk, Mahua Road, Hajipur, Vaishali District, Bihar – 844102</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Open 7 Days: 9:30 AM – 9:00 PM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Phone / WhatsApp: +91 6206875074</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Merchant SaaS Solution</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Powered by Multitenant Indian Retailer E-Commerce Engine with 5km delivery geo-fencing,
              WhatsApp automated broadcasts, and old-stock liquidation.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentView('admin')}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors text-center"
              >
                Access Merchant Admin Portal
              </button>
              <button
                onClick={() => setCurrentView('super-admin')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 px-3 rounded-lg text-[11px] transition-colors text-center"
              >
                Super Admin Multi-Store Directory
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Rupesh Vastralaya & Shopping Mall. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for local Bharat retailers with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in Hajipur, Bihar
          </p>
        </div>
      </div>
    </footer>
  );
};
