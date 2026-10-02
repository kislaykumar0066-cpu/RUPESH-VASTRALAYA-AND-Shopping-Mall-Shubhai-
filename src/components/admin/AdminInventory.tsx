import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  TrendingDown,
  Layers,
  Edit,
  Trash2,
  Heart,
  Tag,
  Flame,
  Shirt,
  User,
  Sparkles,
  Scissors,
  Smile,
  X,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronRight,
  List,
  LayoutGrid,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { DeleteProductConfirmModal } from './DeleteProductConfirmModal';

interface CategoryOption {
  id: string;
  name: string;
  hindi: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_TABS: CategoryOption[] = [
  { id: 'ALL', name: 'All Garments', hindi: 'सभी आइटम', icon: Layers },
  { id: 'saree', name: 'Saree', hindi: 'साड़ी', icon: Flame },
  { id: 'kurti', name: 'Kurti & Suits', hindi: 'कुर्ती व सूट', icon: Shirt },
  { id: 'gents', name: 'Gents Wear', hindi: 'जेंट्स वियर', icon: User },
  { id: 'ladies', name: 'Ladies Wear', hindi: 'लेडीज वियर', icon: Sparkles },
  { id: 'shirt', name: 'Shirt', hindi: 'शर्ट', icon: Layers },
  { id: 't-shirt', name: 'T-Shirt', hindi: 'टी-शर्ट', icon: Tag },
  { id: 'jeans', name: 'Jeans', hindi: 'जींस', icon: Scissors },
  { id: 'children', name: 'Children', hindi: 'बच्चों के कपड़े', icon: Smile },
  { id: 'other', name: 'Other', hindi: 'अन्य', icon: Package },
];

export const AdminInventory: React.FC = () => {
  const {
    products,
    updateProductStock,
    setIsAddSkuModalOpen,
    deleteProduct,
    setActiveEditProduct,
    shopkeeperWishlist,
    toggleShopkeeperWishlist,
    setAdminTab,
    adminSearchQuery,
    setAdminSearchQuery,
  } = useStore();

  // Search input initialized with global adminSearchQuery if present
  const [search, setSearch] = useState(adminSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'CRITICAL' | 'STAGNANT' | 'OUT_OF_STOCK'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'category-grouped'>('table');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  // Sync with global header search if it changes
  useEffect(() => {
    if (adminSearchQuery !== search) {
      setSearch(adminSearchQuery);
    }
  }, [adminSearchQuery]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setAdminSearchQuery(val);
  };

  const handleClearSearch = () => {
    setSearch('');
    setAdminSearchQuery('');
  };

  const handleConfirmDelete = (id: string) => {
    const target = products.find((p) => p.id === id);
    deleteProduct(id);
    setDeleteSuccessToast(`"${target?.name || 'Product'}" has been permanently deleted from store catalogue.`);
    setTimeout(() => setDeleteSuccessToast(null), 4000);
  };

  // Inline Quick Stock Increment/Decrement for immediate on-shelf adjustments
  const handleInlineStockChange = (productId: string, variantId: string, delta: number, currentStock: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateProductStock(productId, variantId, newStock);
  };

  // Comprehensive Product Filtering: Matches Name, Hindi Name, Description, Fabric, Brand, SKU & Category
  const filteredProducts = products.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
      (p.fabric && p.fabric.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      p.variants.some(
        (v) =>
          v.size.toLowerCase().includes(query) ||
          v.color.toLowerCase().includes(query) ||
          v.sku.toLowerCase().includes(query)
      );

    const matchesCategory =
      selectedCategory === 'ALL' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    if (stockFilter === 'CRITICAL') return matchesSearch && matchesCategory && p.totalStock > 0 && p.totalStock <= 4;
    if (stockFilter === 'OUT_OF_STOCK') return matchesSearch && matchesCategory && p.totalStock === 0;
    if (stockFilter === 'STAGNANT') return matchesSearch && matchesCategory && p.isStagnant;

    return matchesSearch && matchesCategory;
  });

  // Complete Inventory Calculations
  const grandTotalUnits = products.reduce((sum, p) => sum + p.totalStock, 0);
  const grandTotalValuation = products.reduce((sum, p) => sum + p.discountPrice * p.totalStock, 0);
  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= 4).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const stagnantCount = products.filter((p) => p.isStagnant).length;

  // Compute category-wise stock statistics
  const getCategoryStats = (catId: string) => {
    const catProducts =
      catId === 'ALL'
        ? products
        : products.filter((p) => p.category.toLowerCase() === catId.toLowerCase());
    const count = catProducts.length;
    const totalStock = catProducts.reduce((sum, p) => sum + p.totalStock, 0);
    return { count, totalStock };
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
            className="text-emerald-700 hover:text-emerald-950 font-black px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-700" />
              <span>Store Inventory & Complete Stock Master</span>
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
              {products.length} Active SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Category-wise listing, multi-size variant tracking, description search, and instant on-shelf atomic stock adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Main Inventory Search Bar (Searches Name, Description, SKU, Fabric, etc.) */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, description, SKU, fabric..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-7 py-1.5 text-xs outline-none focus:border-red-600 focus:bg-white"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddSkuModalOpen(true)}
            className="bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add SKU</span>
          </button>
        </div>
      </div>

      {/* 1. Complete Item Stock Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Store Stock</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{grandTotalUnits}</span>
            <span className="text-xs text-slate-500 font-semibold">pcs</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            Across {products.length} product SKUs
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Stock Valuation</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-800">
              ₹{grandTotalValuation.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">At current selling prices</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Low Stock Items</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-rose-700">{lowStockCount}</span>
            <span className="text-xs text-rose-600 font-bold">Alert</span>
          </div>
          <span className="text-[10px] text-rose-600 block mt-0.5">Stock is ≤ 4 pcs</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Out of Stock</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-700">{outOfStockCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Depleted</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Needs vendor restock</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-4 lg:col-span-1 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 block">Promotional Wishlist</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-rose-600">{shopkeeperWishlist.length}</span>
            <span className="text-xs text-rose-700 font-bold">Shortlisted</span>
          </div>
          <button
            onClick={() => setAdminTab('wishlist')}
            className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer mt-0.5"
          >
            <span>Manage Discounts →</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY-WISE LIST OPTIONS (Saree, Suits, Gents Wear, Shirt, Jeans, etc.) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-700" />
            <span>Select Category to View Stock List-Wise:</span>
          </span>

          {/* View mode toggle: Standard Table vs Grouped List */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3 h-3" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('category-grouped')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'category-grouped' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Category Grouped</span>
            </button>
          </div>
        </div>

        {/* Category Pills with Stock Count & Hindi Names */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            const Icon = cat.icon;
            const stats = getCategoryStats(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#b91c1c] text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-red-700'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] font-normal hidden sm:inline ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                  ({cat.hindi})
                </span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {stats.totalStock} pcs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Health & Stock Status Filters */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStockFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              stockFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Stock Status ({filteredProducts.length})
          </button>

          <button
            onClick={() => setStockFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              stockFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock (≤ 4 pcs) ({lowStockCount})</span>
          </button>

          <button
            onClick={() => setStockFilter('OUT_OF_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              stockFilter === 'OUT_OF_STOCK'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Out of Stock (0 pcs) ({outOfStockCount})</span>
          </button>

          <button
            onClick={() => setStockFilter('STAGNANT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              stockFilter === 'STAGNANT'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Stagnant Liquidation ({stagnantCount})</span>
          </button>
        </div>

        {search && (
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
            <span>
              Search results for "<strong>{search}</strong>" in names & descriptions ({filteredProducts.length})
            </span>
            <button
              onClick={handleClearSearch}
              className="text-red-700 font-bold hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 4. INVENTORY PRESENTATION (Table or Grouped by Category) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No products match "{search || selectedCategory}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching a different item name or description keyword, or select "All Garments" in the category tabs.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setAdminSearchQuery('');
              setSelectedCategory('ALL');
              setStockFilter('ALL');
            }}
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* STANDARD INVENTORY TABLE WITH COMPLETE STOCK */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Item & Photo</th>
                  <th className="py-3 px-4">Category & Fabric</th>
                  <th className="py-3 px-4">Description Preview</th>
                  <th className="py-3 px-4">Price / MRP</th>
                  <th className="py-3 px-4">Variant Stock (Quick Adjust +/-)</th>
                  <th className="py-3 px-4 text-center">Complete Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isLow = product.totalStock > 0 && product.totalStock <= 4;
                  const isOut = product.totalStock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Item & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-12 h-14 object-cover rounded-lg border border-slate-200 shrink-0 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                            {product.hindiName && (
                              <p className="text-[11px] text-slate-500">{product.hindiName}</p>
                            )}
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              SKU: <strong>{product.sku}</strong> • {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Fabric */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded w-max">
                          {product.category}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Fabric: <strong className="text-slate-700">{product.fabric}</strong>
                        </span>
                      </td>

                      {/* Description Preview with Search Highlighting */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-black text-slate-900 text-sm">
                          ₹{product.discountPrice.toLocaleString('en-IN')}
                        </p>
                        {product.price > product.discountPrice && (
                          <p className="text-[10px] text-slate-400 line-through">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>

                      {/* Complete Variant-Level Stock with Quick +/- Adjusters */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {product.variants.map((v) => (
                            <div
                              key={v.id}
                              className={`border rounded-lg px-2 py-1 text-[10px] flex items-center gap-1.5 shadow-2xs ${
                                v.stock === 0
                                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                                  : v.stock <= 2
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-bold">{v.size}:</span>
                              <span className="font-mono font-black">{v.stock} pcs</span>

                              {/* Quick Inline Increment/Decrement */}
                              <div className="flex items-center gap-0.5 ml-1 border-l pl-1 border-slate-300">
                                <button
                                  type="button"
                                  onClick={() => handleInlineStockChange(product.id, v.id, -1, v.stock)}
                                  className="w-4 h-4 bg-white hover:bg-slate-200 text-slate-700 rounded flex items-center justify-center font-bold cursor-pointer"
                                  title="Deduct 1 piece"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInlineStockChange(product.id, v.id, 1, v.stock)}
                                  className="w-4 h-4 bg-white hover:bg-slate-200 text-slate-700 rounded flex items-center justify-center font-bold cursor-pointer"
                                  title="Add 1 piece"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Complete Total Item Stock */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex flex-col items-center justify-center font-black text-xs px-3 py-1.5 rounded-xl border ${
                            isOut
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <span className="text-sm font-black">{product.totalStock} pcs</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                            {isOut ? 'Depleted' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </span>
                      </td>

                      {/* Actions: Wishlist, Edit, Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => toggleShopkeeperWishlist(product.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              shopkeeperWishlist.includes(product.id)
                                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-rose-600'
                            }`}
                            title={
                              shopkeeperWishlist.includes(product.id)
                                ? 'In Wishlist (Click to remove)'
                                : 'Add to Wishlist to apply discount or delete'
                            }
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                shopkeeperWishlist.includes(product.id) ? 'fill-rose-600 text-rose-600' : ''
                              }`}
                            />
                          </button>

                          <button
                            onClick={() => setActiveEditProduct(product)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product Details & AI Image"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product from Store"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CATEGORY-GROUPED LIST VIEW (List-wise categories: Saree, Suits, Gents Wear, etc.) */
        <div className="space-y-5">
          {CATEGORY_TABS.filter((c) => c.id !== 'ALL').map((categoryTab) => {
            const categoryItems = filteredProducts.filter(
              (p) => p.category.toLowerCase() === categoryTab.id.toLowerCase()
            );

            if (categoryItems.length === 0) return null;

            const categoryStock = categoryItems.reduce((sum, p) => sum + p.totalStock, 0);
            const Icon = categoryTab.icon;

            return (
              <div
                key={categoryTab.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-5"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>{categoryTab.name}</span>
                        <span className="text-xs font-normal text-slate-500">({categoryTab.hindi})</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {categoryItems.length} Product Models • Total Stock in Category:{' '}
                        <strong className="text-slate-900 font-bold">{categoryStock} pieces</strong>
                      </p>
                    </div>
                  </div>

                  <span className="bg-red-50 text-red-800 text-xs font-black px-3 py-1 rounded-full border border-red-200">
                    {categoryStock} pcs in stock
                  </span>
                </div>

                {/* List of Products in this category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {categoryItems.map((product) => {
                    const isLow = product.totalStock > 0 && product.totalStock <= 4;
                    const isOut = product.totalStock === 0;

                    return (
                      <div
                        key={product.id}
                        className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-14 h-16 object-cover rounded-lg border border-slate-200 shrink-0 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                              {product.name}
                            </h4>
                            {product.hindiName && (
                              <p className="text-[11px] text-slate-500">{product.hindiName}</p>
                            )}
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-tight">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                              <span>SKU: <strong>{product.sku}</strong></span>
                              <span>•</span>
                              <span>Fabric: <strong>{product.fabric}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Complete Variant Stock with Quick Adjusters */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-600">Complete Stock by Size:</span>
                            <span
                              className={`font-black px-2 py-0.5 rounded text-[10px] ${
                                isOut
                                  ? 'bg-red-100 text-red-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Total: {product.totalStock} pcs
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.map((v) => (
                              <div
                                key={v.id}
                                className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-[10px] flex items-center gap-1.5"
                              >
                                <span className="font-bold text-slate-700">{v.size}:</span>
                                <span className="font-black font-mono text-slate-900">{v.stock} pcs</span>
                                <div className="flex items-center gap-0.5 border-l pl-1 border-slate-300">
                                  <button
                                    type="button"
                                    onClick={() => handleInlineStockChange(product.id, v.id, -1, v.stock)}
                                    className="w-3.5 h-3.5 bg-white text-slate-700 hover:bg-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleInlineStockChange(product.id, v.id, 1, v.stock)}
                                    className="w-3.5 h-3.5 bg-white text-slate-700 hover:bg-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Actions Bottom Bar */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-sm font-black text-slate-900">
                              ₹{product.discountPrice.toLocaleString('en-IN')}
                            </span>
                            {product.price > product.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleShopkeeperWishlist(product.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                shopkeeperWishlist.includes(product.id)
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-white text-slate-400 hover:text-rose-600 border'
                              }`}
                              title="Wishlist toggle"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  shopkeeperWishlist.includes(product.id) ? 'fill-rose-600 text-rose-600' : ''
                                }`}
                              />
                            </button>

                            <button
                              onClick={() => setActiveEditProduct(product)}
                              className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setProductToDelete(product)}
                              className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      <DeleteProductConfirmModal
        product={productToDelete}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
