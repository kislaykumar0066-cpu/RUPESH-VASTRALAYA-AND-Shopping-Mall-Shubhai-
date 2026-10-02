import React from 'react';
import { Sparkles, Truck, ShieldCheck, ArrowRight, Tag, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setIsCartDrawerOpen, shopSettings } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-900 to-stone-900 text-white py-8 md:py-14 border-b-4 border-amber-500">
      {/* Background Indian ornamental accent pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Festive Bridal & Wedding Season 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Rupesh Vastralaya <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                & Shopping Mall
              </span>
            </h1>

            <p className="text-sm md:text-base text-stone-200 max-w-xl leading-relaxed">
              Shubhai Chowk's landmark showroom for Banarasi Katan sarees, designer bridal georgettes,
              festive kurtis, gents sherwanis, and children's party wear.
            </p>

            {/* Local 5km Delivery Badge */}
            <div className="bg-red-950/70 border border-red-700/80 rounded-xl p-3 max-w-lg flex items-center gap-3 shadow-inner">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-red-950 flex items-center justify-center font-black shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-amber-300 text-xs sm:text-sm">
                  ⚡ 5km Local Express Delivery Guaranteed
                </p>
                <p className="text-[11px] text-stone-300">
                  Free 24-hr doorstep delivery across Shubhai, Mahua Road, Anjanpir & Hajipur town.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedCategory('saree')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold px-6 py-2.5 rounded-lg text-sm transition-all shadow-lg flex items-center gap-2 transform active:scale-95"
              >
                <span>Shop Saree Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/91${shopSettings.whatsapp}?text=Namaste! I want to view catalog and order via WhatsApp from Rupesh Vastralaya`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Spotlight Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div
              onClick={() => setSelectedCategory('saree')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group"
            >
              <div className="relative rounded-lg overflow-hidden h-36 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"
                  alt="Banarasi Saree"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                  FLAT 60% OFF
                </span>
              </div>
              <h3 className="font-bold text-white text-xs line-clamp-1">Banarasi Katan Silk</h3>
              <p className="text-[11px] text-amber-300 font-semibold mt-0.5">₹1,799 <span className="line-through text-stone-400 text-[10px]">₹4,499</span></p>
            </div>

            <div
              onClick={() => setSelectedCategory('kurti')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group"
            >
              <div className="relative rounded-lg overflow-hidden h-36 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1583391733975-dd28318eecf9?auto=format&fit=crop&w=400&q=80"
                  alt="Chanderi Kurti"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                  FESTIVE SPECIAL
                </span>
              </div>
              <h3 className="font-bold text-white text-xs line-clamp-1">Chanderi Gotta Patti</h3>
              <p className="text-[11px] text-amber-300 font-semibold mt-0.5">₹2,899 <span className="line-through text-stone-400 text-[10px]">₹7,250</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
