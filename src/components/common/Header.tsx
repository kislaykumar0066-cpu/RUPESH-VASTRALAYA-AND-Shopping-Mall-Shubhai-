import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  Truck,
  Phone,
  LayoutDashboard,
  Globe,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getTranslation } from '../../lib/translations';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    cartItemsCount,
    setIsCartDrawerOpen,
    wishlist,
    currentCustomer,
    setIsAuthModalOpen,
    logoutCustomer,
    shopSettings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-red-100 shadow-sm">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-amber-400 text-red-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Special
            </span>
            <span className="hidden sm:inline">Shubhai Chowk Mahotsav:</span>
            <span>⚡ 5km Local Express Delivery within 24 Hours in Hajipur!</span>
          </div>

          <div className="flex items-center gap-4 text-amber-100 shrink-0">
            <a
              href={`https://wa.me/91${shopSettings.whatsapp}?text=Namaste! I want to order from Rupesh Vastralaya`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-green-300" />
              <span className="hidden md:inline">WhatsApp Order:</span>
              <span className="font-semibold text-white">6206875074</span>
            </a>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 bg-red-900/60 hover:bg-red-900 text-amber-200 px-2 py-0.5 rounded border border-red-600/50 text-[11px] font-semibold"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-red-700 bg-red-50/60' : ''
                    }`}
                  >
                    English <span>EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center justify-between ${
                      language === 'hi' ? 'font-bold text-red-700 bg-red-50/60' : ''
                    }`}
                  >
                    हिन्दी <span>HI</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hinglish');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center justify-between ${
                      language === 'hinglish' ? 'font-bold text-red-700 bg-red-50/60' : ''
                    }`}
                  >
                    Hinglish <span>HN</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Logo & Shop Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('storefront')}
              className="text-left group flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-red-700 to-amber-600 text-white font-extrabold flex items-center justify-center shadow-md text-xl tracking-tighter border border-amber-300">
                RV
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-lg md:text-xl text-red-800 tracking-tight leading-tight group-hover:text-red-900 transition-colors">
                    Rupesh Vastralaya
                  </h1>
                  <span className="hidden sm:inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                    & Shopping Mall
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 leading-none mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Shubhai Chowk, Mahua Rd, Hajipur
                </p>
              </div>
            </button>
          </div>

          {/* Search Input Bar (Flipkart Style) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder={getTranslation(language, 'searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 hover:border-red-400 focus:border-red-600 focus:bg-white rounded-lg py-2 pl-10 pr-24 text-sm outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
              <span className="absolute right-2 top-1.5 bg-red-600 text-white font-semibold text-xs px-3 py-1 rounded">
                Search
              </span>
            </div>
          </div>

          {/* Action Buttons: Customer Auth, Wishlist, Cart & Merchant Admin Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Merchant Admin Portal Switch Button */}
            <button
              onClick={() => setCurrentView(currentView === 'storefront' ? 'admin' : 'storefront')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                currentView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-red-700 hover:bg-red-800 text-white border border-red-800'
              }`}
              title="Toggle Merchant SaaS Admin View"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentView === 'storefront' ? 'Merchant Admin' : 'Customer Store'}
              </span>
            </button>

            {/* Customer Account / Sign in */}
            {currentCustomer ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-slate-700 hover:text-red-700 text-xs font-semibold px-2 py-1.5 rounded hover:bg-red-50 transition-colors">
                  <User className="w-4 h-4 text-red-600" />
                  <span className="hidden lg:inline">{currentCustomer.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{currentCustomer.name}</p>
                    <p className="text-[11px] text-slate-500">{currentCustomer.mobile}</p>
                  </div>
                  <button
                    onClick={logoutCustomer}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 text-slate-700 hover:text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded hover:bg-red-50 border border-slate-200"
              >
                <User className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">{getTranslation(language, 'login')}</span>
              </button>
            )}

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">{getTranslation(language, 'cart')}</span>
              {cartItemsCount > 0 && (
                <span className="bg-red-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ml-0.5 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder={getTranslation(language, 'searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:border-red-600 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
