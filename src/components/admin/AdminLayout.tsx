import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Radio,
  MapPin,
  Users,
  Settings,
  Store,
  HelpCircle,
  Sparkles,
  Search,
  Plus,
  Phone,
  CheckCircle,
  X,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  LogOut,
  Clock,
  Heart,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { EditProductModal } from './EditProductModal';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    setCurrentView,
    shopSettings,
    setIsAddSkuModalOpen,
    setIsUpgradeModalOpen,
    logoutAdmin,
    activeEditProduct,
    setActiveEditProduct,
    shopkeeperWishlist,
    products,
    adminSearchQuery,
    setAdminSearchQuery,
  } = useStore();

  const [topBannerDismissed, setTopBannerDismissed] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live product search across name, description, hindiName, fabric, category, SKU
  const matchingSearchProducts = adminSearchQuery.trim()
    ? products.filter((p) => {
        const q = adminSearchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.variants.some((v) => v.size.toLowerCase().includes(q) || v.color.toLowerCase().includes(q))
        );
      })
    : [];

  const navItems = [
    { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: '12 New', badgeColor: 'bg-red-600 text-white' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: 'HOT !', badgeColor: 'bg-orange-500 text-white' },
    {
      id: 'wishlist',
      label: 'Product Wishlist',
      icon: Heart,
      badge: shopkeeperWishlist.length > 0 ? `${shopkeeperWishlist.length}` : undefined,
      badgeColor: 'bg-rose-600 text-white',
    },
    { id: 'whatsapp', label: 'WhatsApp Broadcast', icon: Radio },
    { id: 'delivery', label: 'Local Delivery (5km)', icon: MapPin },
    { id: 'customers', label: 'Customers', icon: Users, badge: '1,420', badgeColor: 'text-slate-400 font-normal' },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Top SaaS Pro Plan Free Trial Banner (as seen in Image 3) */}
      {!topBannerDismissed && (
        <div className="bg-[#8b1515] text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-bold">
              Retailer SaaS Pro Plan: 7-Day Free Trial ({shopSettings.trialDaysRemaining} Days Remaining)
            </span>
            <span className="hidden md:inline text-amber-200">
              — Upgrade to Monthly Plan @ ₹2999/mo to retain automated WhatsApp broadcast engine
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-white text-red-900 hover:bg-amber-100 text-[11px] font-extrabold px-3 py-1 rounded shadow transition-all cursor-pointer"
            >
              Upgrade @ ₹2999/mo
            </button>
            <button
              onClick={() => setTopBannerDismissed(true)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar (as shown in Image 3) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
          <div>
            {/* Sidebar Brand Header */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#b91c1c] text-white font-black flex items-center justify-center text-sm shadow">
                R
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-sm text-slate-900 truncate">Rupesh Merchant S...</h2>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Shubhai & Vaishali Hub
                </p>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = adminTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAdminTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#b91c1c] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar SaaS Trial Widget & Links (Image 3) */}
          <div className="p-3 border-t border-slate-200 space-y-2">
            {/* Pro Trial Countdown Card */}
            <div className="bg-red-50/80 border border-red-200 rounded-xl p-3 text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-900">
                  PRO TRIAL
                </span>
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  {shopSettings.trialDaysRemaining}d left
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Unlock infinite WhatsApp catalogs & automatic GST invoices.
              </p>
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-extrabold py-1.5 px-2 rounded-lg text-[11px] transition-colors shadow-xs"
              >
                Upgrade Subscription
              </button>
            </div>

            <div className="pt-1 space-y-1">
              <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Auto-lock:
                </span>
                <span className="font-bold text-slate-700">15m idle</span>
              </div>

              <button
                onClick={() => setAdminTab('settings')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Help & Support</span>
              </button>

              <button
                onClick={() => setCurrentView('storefront')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Store className="w-3.5 h-3.5 text-red-700" />
                <span>Switch to Storefront</span>
              </button>

              <button
                onClick={() => {
                  logoutAdmin();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Container */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Admin Store Header (as shown in Image 3) */}
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  {shopSettings.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified GST Merchant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Main Road Shubhai Chowk, Shubhai, Vaishali, Bihar • Multitenant Admin Console
              </p>
            </div>

            {/* Right Action Tools: Search, Order via WhatsApp, Add SKU */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search item name, description, SKU..."
                  value={adminSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setAdminTab('inventory');
                      setIsSearchFocused(false);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-7 py-1.5 text-xs outline-none focus:border-red-600 focus:bg-white"
                />

                {adminSearchQuery && (
                  <button
                    onClick={() => {
                      setAdminSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Instant Live Search Results Popover Dropdown */}
                {isSearchFocused && adminSearchQuery.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-xs max-h-96 flex flex-col">
                    <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-slate-500 font-bold text-[11px]">
                      <span>
                        Found {matchingSearchProducts.length} item{matchingSearchProducts.length === 1 ? '' : 's'} matching "{adminSearchQuery}"
                      </span>
                      <button
                        onMouseDown={() => setIsSearchFocused(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        Close
                      </button>
                    </div>

                    <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                      {matchingSearchProducts.length === 0 ? (
                        <div className="p-4 text-center text-slate-400">
                          <p className="font-semibold">No products found matching your search</p>
                          <p className="text-[10px] mt-0.5">Try searching saree, kurti, silk, denim, or SKU code</p>
                        </div>
                      ) : (
                        matchingSearchProducts.slice(0, 6).map((prod) => (
                          <div
                            key={prod.id}
                            onMouseDown={() => {
                              setActiveEditProduct(prod);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 hover:bg-red-50/50 flex items-center gap-3 transition-colors cursor-pointer group"
                          >
                            <img
                              src={prod.images[0]}
                              alt=""
                              className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 group-hover:text-red-700 truncate">
                                  {prod.name}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded uppercase font-semibold">
                                  {prod.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {prod.description}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-600">
                                <span className="font-mono font-bold text-slate-700">{prod.sku}</span>
                                <span>•</span>
                                <span className="font-bold text-slate-900">₹{prod.discountPrice}</span>
                                <span>•</span>
                                <span className={prod.totalStock <= 4 ? 'font-bold text-red-600' : 'font-semibold text-emerald-700'}>
                                  Stock: {prod.totalStock} pcs
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onMouseDown={() => {
                          setAdminTab('inventory');
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-center bg-red-700 hover:bg-red-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
                      >
                        View all {matchingSearchProducts.length} items in Inventory & Stock →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <a
                href={`https://wa.me/91${shopSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0f6f43] hover:bg-[#0c5936] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Order via WhatsApp</span>
              </a>

              <button
                onClick={() => setIsAddSkuModalOpen(true)}
                className="bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add SKU</span>
              </button>
            </div>
          </header>

          {/* Tab Navigation for Mobile */}
          <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap ${
                  adminTab === item.id ? 'bg-[#b91c1c] text-white' : 'text-slate-600 bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Admin Body Content */}
          <main className="p-4 sm:p-6 space-y-6">{children}</main>

          {/* Edit Product Modal */}
          <EditProductModal
            product={activeEditProduct}
            isOpen={!!activeEditProduct}
            onClose={() => setActiveEditProduct(null)}
          />
        </div>
      </div>
    </div>
  );
};
