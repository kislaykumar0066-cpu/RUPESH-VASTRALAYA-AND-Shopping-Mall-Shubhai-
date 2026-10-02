import React, { useState } from 'react';
import {
  Heart,
  Tag,
  Percent,
  Trash2,
  Edit,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShoppingBag,
  ExternalLink,
  Plus,
  Send,
  Sliders,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { DeleteProductConfirmModal } from './DeleteProductConfirmModal';

export const AdminWishlistDiscounts: React.FC = () => {
  const {
    products,
    shopkeeperWishlist,
    toggleShopkeeperWishlist,
    applyDiscountToProduct,
    removeDiscountFromProduct,
    deleteProduct,
    setActiveEditProduct,
    setCurrentView,
    shopSettings,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [discountFilter, setDiscountFilter] = useState<'ALL' | 'DISCOUNTED' | 'NO_DISCOUNT'>('ALL');
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [customDiscountInputs, setCustomDiscountInputs] = useState<Record<string, string>>({});
  const [customPriceInputs, setCustomPriceInputs] = useState<Record<string, string>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string } | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  const handleConfirmDelete = (id: string) => {
    const target = products.find((p) => p.id === id);
    deleteProduct(id);
    setDeleteSuccessToast(`"${target?.name || 'Product'}" has been permanently deleted from store.`);
    setTimeout(() => setDeleteSuccessToast(null), 4000);
  };

  // Products currently in the shopkeeper's wishlist
  const wishlistedProducts = products.filter((p) => shopkeeperWishlist.includes(p.id));

  // Products available to add to wishlist
  const nonWishlistedProducts = products.filter((p) => !shopkeeperWishlist.includes(p.id));

  // Filtered wishlisted products
  const filteredProducts = wishlistedProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(search));

    const matchesCategory = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const isDiscounted = p.discountPrice < p.price;
    const matchesDiscount =
      discountFilter === 'ALL' ||
      (discountFilter === 'DISCOUNTED' && isDiscounted) ||
      (discountFilter === 'NO_DISCOUNT' && !isDiscounted);

    return matchesSearch && matchesCategory && matchesDiscount;
  });

  // KPI calculations
  const totalWishlisted = wishlistedProducts.length;
  const discountedCount = wishlistedProducts.filter((p) => p.discountPrice < p.price).length;
  const avgDiscount =
    discountedCount > 0
      ? Math.round(
          wishlistedProducts
            .filter((p) => p.discountPrice < p.price)
            .reduce((sum, p) => sum + Math.round(((p.price - p.discountPrice) / p.price) * 100), 0) /
            discountedCount
        )
      : 0;
  const totalStockMonitored = wishlistedProducts.reduce((sum, p) => sum + p.totalStock, 0);

  const handleApplyPresetDiscount = (productId: string, percent: number) => {
    applyDiscountToProduct(productId, percent);
    setFeedbackMsg({ id: productId, text: `Applied ${percent}% Discount!` });
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleApplyCustomPercent = (product: Product) => {
    const inputVal = customDiscountInputs[product.id];
    const percent = parseFloat(inputVal);
    if (!isNaN(percent) && percent > 0 && percent < 100) {
      applyDiscountToProduct(product.id, percent);
      setFeedbackMsg({ id: product.id, text: `Applied ${percent}% Discount!` });
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  const handleApplyCustomPrice = (product: Product) => {
    const inputVal = customPriceInputs[product.id];
    const newPrice = parseFloat(inputVal);
    if (!isNaN(newPrice) && newPrice > 0 && newPrice <= product.price) {
      applyDiscountToProduct(product.id, 0, newPrice);
      setFeedbackMsg({ id: product.id, text: `Sale price set to ₹${newPrice.toLocaleString('en-IN')}!` });
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  const handleRemoveDiscount = (productId: string) => {
    removeDiscountFromProduct(productId);
    setFeedbackMsg({ id: productId, text: 'Discount reset to MRP!' });
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleApplyBulkDiscount = (percent: number) => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach((p) => {
      applyDiscountToProduct(p.id, percent);
    });
    setFeedbackMsg({ id: 'bulk', text: `Applied ${percent}% discount to all ${wishlistedProducts.length} wishlist items!` });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Delete Success Alert Toast */}
      {deleteSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{deleteSuccessToast}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950 font-black px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold mb-2 text-rose-100">
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              <span>Merchant Shortlist & Discount Control</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Shopkeeper Product Wishlist
            </h2>
            <p className="text-xs text-rose-100/90 max-w-2xl mt-1">
              Keep your targeted items here to review stock, apply instant percentage or festive discounts, launch WhatsApp clearance deals, or permanently delete discontinued products from your store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddPicker(!showAddPicker)}
              className="bg-white text-rose-900 hover:bg-rose-50 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Items to Wishlist</span>
            </button>

            <button
              onClick={() => setCurrentView('storefront')}
              className="bg-rose-950/60 hover:bg-rose-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Wishlisted Items</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{totalWishlisted}</span>
            <span className="text-[10px] text-slate-400">Garments in shortlist</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Active Discounts</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">{discountedCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Running special offer</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Average Discount</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">{avgDiscount}%</span>
            <span className="text-[10px] text-slate-400">On discounted items</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Monitored Stock</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{totalStockMonitored}</span>
            <span className="text-[10px] text-slate-400">Total units in stock</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Add to Wishlist Quick Picker (Accordion/Modal) */}
      {showAddPicker && (
        <div className="bg-white p-5 rounded-2xl border-2 border-rose-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Add More Products to Your Wishlist</span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose any item from your catalog to shortlist it for price discounts or deletion.
              </p>
            </div>
            <button
              onClick={() => setShowAddPicker(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              Close
            </button>
          </div>

          {nonWishlistedProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">
              All items in your catalog are already in your wishlist!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {nonWishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/30 transition-all gap-2"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {p.sku} • ₹{p.discountPrice}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleShopkeeperWishlist(p.id)}
                    className="bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search & Category */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search wishlist by title, SKU, fabric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-rose-600 focus:bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-rose-600"
          >
            <option value="ALL">All Categories</option>
            <option value="saree">Sarees</option>
            <option value="kurti">Kurtis</option>
            <option value="ladies">Ladies Wear</option>
            <option value="gents">Gents Wear</option>
            <option value="shirt">Shirts</option>
            <option value="t-shirt">T-Shirts</option>
            <option value="jeans">Jeans</option>
            <option value="children">Children</option>
          </select>

          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-bold">
            <button
              onClick={() => setDiscountFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                discountFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              All ({wishlistedProducts.length})
            </button>
            <button
              onClick={() => setDiscountFilter('DISCOUNTED')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                discountFilter === 'DISCOUNTED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Discounted ({discountedCount})
            </button>
            <button
              onClick={() => setDiscountFilter('NO_DISCOUNT')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                discountFilter === 'NO_DISCOUNT' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              At MRP ({totalWishlisted - discountedCount})
            </button>
          </div>
        </div>

        {/* Right: Bulk Discount Actions */}
        <div className="flex items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 hidden xl:inline">Bulk Wishlist Action:</span>
          <button
            onClick={() => handleApplyBulkDiscount(20)}
            className="text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-lg cursor-pointer transition-colors"
          >
            All -20%
          </button>
          <button
            onClick={() => handleApplyBulkDiscount(40)}
            className="text-[11px] font-bold px-2 py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 rounded-lg cursor-pointer transition-colors"
          >
            All -40%
          </button>
          <button
            onClick={() => handleApplyBulkDiscount(60)}
            className="text-[11px] font-bold px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg cursor-pointer transition-colors"
          >
            Clearance -60%
          </button>
        </div>
      </div>

      {/* 5. Wishlist Items List / Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            {wishlistedProducts.length === 0
              ? 'Your Promotional Wishlist is Empty'
              : 'No items match your filter criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {wishlistedProducts.length === 0
              ? 'Add products you wish to put on discount, monitor closely, or delete. Click "Add Items to Wishlist" above or click the heart icon on any product in your inventory!'
              : 'Try clearing your search query or selecting a different category filter.'}
          </p>
          {wishlistedProducts.length === 0 && (
            <button
              onClick={() => {
                // Add first 3 products as demo
                products.slice(0, 3).forEach((p) => {
                  if (!shopkeeperWishlist.includes(p.id)) {
                    toggleShopkeeperWishlist(p.id);
                  }
                });
              }}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick-Add Featured Sarees & Kurtis</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discountPrice < product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            const currentPercentInput = customDiscountInputs[product.id] ?? '';
            const currentPriceInput = customPriceInputs[product.id] ?? '';

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs p-4 sm:p-5 transition-all space-y-4"
              >
                {/* Feedback Toast */}
                {feedbackMsg?.id === product.id && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{feedbackMsg.text}</span>
                  </div>
                )}

                {/* Top: Product Info & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-slate-200 shrink-0 shadow-xs"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {product.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-500">
                          SKU: {product.sku}
                        </span>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {product.fabric}
                        </span>
                        {product.isStagnant && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            <span>Stagnant Stock</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900">
                        {product.name}
                      </h3>
                      {product.hindiName && (
                        <p className="text-xs text-slate-500">{product.hindiName}</p>
                      )}

                      {/* Stock info */}
                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                        <span>Total Units: <strong>{product.totalStock}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.variants.map((v) => (
                            <span key={v.id} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                              {v.size}: <strong>{v.stock}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price display block */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline gap-2 sm:justify-end">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          ₹{product.discountPrice.toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {hasDiscount ? (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-full mt-0.5">
                          {discountPercent}% OFF (Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')})
                        </span>
                      ) : (
                        <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5">
                          Regular MRP (No Discount)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Discount Manager Controls */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-600" />
                      <span>Set Instant Discount / Special Offer Price:</span>
                    </span>

                    {hasDiscount && (
                      <button
                        onClick={() => handleRemoveDiscount(product.id)}
                        className="text-xs font-bold text-slate-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        title="Remove discount and restore to original MRP"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset to MRP</span>
                      </button>
                    )}
                  </div>

                  {/* Quick percentage buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Quick:</span>
                    {[10, 20, 30, 40, 50, 60, 70].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => handleApplyPresetDiscount(product.id, pct)}
                        className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          discountPercent === pct
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200'
                        }`}
                      >
                        -{pct}%
                      </button>
                    ))}
                  </div>

                  {/* Custom Discount Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Custom Percentage */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          placeholder="Custom % (e.g. 35)"
                          value={currentPercentInput}
                          onChange={(e) =>
                            setCustomDiscountInputs((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-rose-600"
                        />
                        <span className="absolute right-3 top-1.5 text-xs font-bold text-slate-400">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCustomPercent(product)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                      >
                        Apply %
                      </button>
                    </div>

                    {/* Custom Exact Rupees Price */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1.5 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          min="1"
                          max={product.price}
                          placeholder={`Custom Sale Price (MRP ₹${product.price})`}
                          value={currentPriceInput}
                          onChange={(e) =>
                            setCustomPriceInputs((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-xs outline-none focus:border-rose-600 font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCustomPrice(product)}
                        className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                      >
                        Set ₹ Price
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom: Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveEditProduct(product)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit details, fabric, variants, or AI photography"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Product</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*${shopSettings.name} Special Offer!*\n\n${product.name}\nMRP: ~₹${product.price}~\nOffer Price: *₹${product.discountPrice}* (${discountPercent}% OFF!)\nAvailable at Shubhai Chowk store & Online Express Delivery!\nOrder: https://wa.me/91${shopSettings.whatsapp}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Broadcast this deal on WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp Deal</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleShopkeeperWishlist(product.id)}
                      className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      Remove from Wishlist
                    </button>

                    <button
                      onClick={() => setProductToDelete(product)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Permanently delete from store catalog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete from Store</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteProductConfirmModal
        product={productToDelete}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
