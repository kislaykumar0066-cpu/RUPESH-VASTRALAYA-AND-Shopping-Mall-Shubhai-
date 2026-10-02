import React, { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Sparkles,
  Truck,
  RotateCcw,
  Check,
  X,
  Phone,
  Flame,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { CategoryPills } from './CategoryPills';
import { ProductCard } from './ProductCard';
import { SIZES, COLORS, FABRICS } from '../../lib/constants';

export const StorefrontView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    shopSettings,
    recentlyAddedProductId,
    setRecentlyAddedProductId,
  } = useStore();

  const highestPriceInCatalogue = Math.max(...products.map((p) => p.discountPrice), 25000);

  // Filters
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(highestPriceInCatalogue);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter application
  const filteredProducts = products.filter((p) => {
    // 1. Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // 2. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
        p.fabric.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Price
    if (p.discountPrice > maxPrice) return false;

    // 4. In stock
    if (inStockOnly && p.totalStock <= 0) return false;

    // 5. Size
    if (selectedSize !== 'all') {
      const hasSize = p.variants.some((v) => v.size === selectedSize && v.stock > 0);
      if (!hasSize) return false;
    }

    // 6. Fabric
    if (selectedFabric !== 'all' && p.fabric !== selectedFabric) {
      return false;
    }

    // 7. Discount
    const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
    if (disc < minDiscount) return false;

    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Festive Hero Carousel */}
      <HeroBanner />

      {/* Flipkart-inspired Category Pills */}
      <CategoryPills />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-red-700" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setSelectedFabric('all');
                    setInStockOnly(false);
                    setMinDiscount(0);
                    setMaxPrice(12000);
                  }}
                  className="text-xs font-semibold text-red-700 hover:text-red-800"
                >
                  Reset All
                </button>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Max Budget: <span className="text-red-700 font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-red-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹12,000</span>
                </div>
              </div>

              {/* Size filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Garment Size</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                      selectedSize === 'all'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    All
                  </button>
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                        selectedSize === sz
                          ? 'bg-red-700 text-white border-red-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Fabric</label>
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600"
                >
                  <option value="all">All Fabrics</option>
                  {FABRICS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount threshold */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Minimum Discount</label>
                <div className="space-y-1 text-xs">
                  {[0, 20, 40, 60].map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                      <input
                        type="radio"
                        name="disc"
                        checked={minDiscount === d}
                        onChange={() => setMinDiscount(d)}
                        className="text-red-700"
                      />
                      <span>{d === 0 ? 'All Discounts' : `${d}% and above`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock only toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-red-700"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            </div>

            {/* 5km Local Delivery Store Highlights Box */}
            <div className="bg-gradient-to-br from-amber-50 to-red-50 p-4 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-red-900">
                <Truck className="w-4 h-4 text-red-700" />
                <span>Shubhai Chowk Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                Our in-house delivery boys deliver garments in pristine condition to your doorstep across Shubhai, Mahua Road, and Hajipur within 24 hours.
              </p>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-4">
            {/* Newly added product celebration banner */}
            {recentlyAddedProductId && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs">✨ New Garment Published by Merchant!</p>
                    <p className="text-[11px] text-emerald-100">
                      Your newly added product is now active in the store and highlighted at the top of the collection.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRecentlyAddedProductId(null)}
                  className="text-white/80 hover:text-white text-xs font-bold px-2 py-1 rounded bg-black/20 shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Header info */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                Showing <strong className="text-red-700 font-black">{filteredProducts.length}</strong> items in Shubhai Catalog
              </span>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filter Dropdown */}
            {mobileFilterOpen && (
              <div className="lg:hidden bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-bold text-xs">Filter Products</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-xs text-red-700">
                    Close
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Max Price: ₹{maxPrice}</label>
                  <input
                    type="range"
                    min="500"
                    max="12000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-red-700"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2 py-1 text-xs rounded border ${
                        selectedSize === sz ? 'bg-red-700 text-white' : 'bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200">
                <p className="font-bold text-slate-700 text-base">No garments found matching filters</p>
                <p className="text-xs text-slate-400">
                  Try adjusting your size, budget, or category to see more options from Rupesh Vastralaya.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(12000);
                    setSelectedSize('all');
                  }}
                  className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
