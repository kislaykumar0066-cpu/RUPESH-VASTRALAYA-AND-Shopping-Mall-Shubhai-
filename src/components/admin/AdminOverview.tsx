import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Radio,
  Clock,
  Sparkles,
  Send,
  Edit2,
  CheckCircle2,
  MapPin,
  Truck,
  RotateCw,
  Sliders,
  ShieldCheck,
  Check,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Product } from '../../types';
import { DeleteProductConfirmModal } from './DeleteProductConfirmModal';

export const AdminOverview: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    products,
    applyOldStockDiscount,
    sendOldStockBroadcast,
    shopSettings,
    updateShopSettings,
    setAdminTab,
    deleteProduct,
    setActiveEditProduct,
  } = useStore();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  // Stagnant items dynamically sourced from current products
  const stagnantProducts = products.filter((p) => p.isStagnant);
  const displayStagnant = stagnantProducts.length > 0 ? stagnantProducts.slice(0, 4) : products.slice(0, 4);

  // Old stock filters
  const [stagnantTab, setStagnantTab] = useState<'3' | '6' | '9' | '12'>('9');
  const [selectedItems, setSelectedItems] = useState<string[]>(() =>
    displayStagnant.map((p) => p.id)
  );
  const [broadcastSentNotification, setBroadcastSentNotification] = useState(false);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Live order filter
  const [orderFilter, setOrderFilter] = useState<'ALL' | '5KM' | 'COD' | 'WHATSAPP'>('ALL');

  // Geo-fence controls
  const [radiusSlider, setRadiusSlider] = useState(shopSettings.deliveryRadiusKm || 5.0);
  const [minOrderInput, setMinOrderInput] = useState(shopSettings.freeDeliveryMinOrder || 999);
  const [otpToggle, setOtpToggle] = useState(shopSettings.instantDeliveryOtpRequired);
  const [promise24HrToggle, setPromise24HrToggle] = useState(shopSettings.delivery24HrPromise);
  const [geoSavedSuccess, setGeoSavedSuccess] = useState(false);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(['prod-01', 'prod-02', 'prod-03', 'prod-04']);
  };

  const handleSendBroadcast = async () => {
    setIsSendingBroadcast(true);
    await sendOldStockBroadcast('Shubhai & Vaishali High-Spenders', selectedItems.length, 60);
    setIsSendingBroadcast(false);
    setBroadcastSentNotification(true);
    setTimeout(() => setBroadcastSentNotification(false), 4000);
  };

  const handleSaveGeoFence = () => {
    updateShopSettings({
      deliveryRadiusKm: radiusSlider,
      freeDeliveryMinOrder: minOrderInput,
      instantDeliveryOtpRequired: otpToggle,
      delivery24HrPromise: promise24HrToggle,
    });
    setGeoSavedSuccess(true);
    setTimeout(() => setGeoSavedSuccess(false), 3000);
  };

  // Filter orders according to selected tab
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === '5KM') return o.deliveryEligibility.isEligible;
    if (orderFilter === 'COD') return o.paymentMethod === 'COD';
    if (orderFilter === 'WHATSAPP') return o.whatsappInvoiceSent;
    return true;
  });

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

      {/* 1. TOP 5 KPI METRICS ROW (Exact structure from Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Today's Sales */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Today's Sales</span>
              <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center text-xs">
                💳
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">₹48,650</div>
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5 mt-0.5">
              <span>↗ +18% vs yesterday</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            UPI: ₹32,400 • COD: ₹16,250
          </div>
        </div>

        {/* KPI 2: Total Orders (Today) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Orders (Today)</span>
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center text-xs">
                🛒
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">142</div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              <span className="font-bold text-red-700">8 Pending</span> • 14 Shipped • 1...
            </div>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 mt-2 flex justify-between">
            <span>94.2% Fulfilled</span>
            <span className="font-bold text-emerald-700">84% Local 5km</span>
          </div>
        </div>

        {/* KPI 3: Inventory Health */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Inventory Health</span>
              <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center text-xs">
                ⚠️
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 mt-2">9 Items Critical</div>
            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              Banarasi Zari Sarees & Cotton Kurtis depleted
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={() => setAdminTab('inventory')}
              className="text-[11px] font-bold text-slate-700 hover:text-red-700 flex items-center gap-1"
            >
              <span>Generate Vendor PO</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* KPI 4: WhatsApp Engine */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">WhatsApp Engine</span>
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
                ▶️
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">24% Conv. Rate</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              3 active automated campaigns running
            </div>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 mt-2 flex justify-between">
            <span>480 Sent</span>
            <span className="font-bold text-emerald-700">64 Inquiries</span>
          </div>
        </div>

        {/* KPI 5: Stagnant Stock Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Stagnant Stock Value</span>
              <span className="bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                9+ Mos Unsold
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">₹1,85,400</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Capital tied in 42 slow-moving festival SKUs
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={handleSendBroadcast}
              className="w-full bg-[#8b1515] hover:bg-red-900 text-white text-[10px] font-extrabold py-1 px-2 rounded text-center transition-colors cursor-pointer"
            >
              Launch Liquidation Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* 2. OLD STOCK LIQUIDATION & WHATSAPP AUTOMATION ENGINE (Exact structure from Image 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Old Stock Liquidation & WhatsApp Automation Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reclaim locked capital by targeting verified local VIP buyers in Vaishali district with targeted clearance discounts.
            </p>
          </div>

          {/* Month Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold shrink-0">
            <button
              onClick={() => setStagnantTab('3')}
              className={`px-3 py-1 rounded-md transition-all ${
                stagnantTab === '3' ? 'bg-[#8b1515] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setStagnantTab('6')}
              className={`px-3 py-1 rounded-md transition-all ${
                stagnantTab === '6' ? 'bg-[#8b1515] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setStagnantTab('9')}
              className={`px-3 py-1 rounded-md transition-all ${
                stagnantTab === '9' ? 'bg-[#8b1515] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              9 Months
            </button>
            <button
              onClick={() => setStagnantTab('12')}
              className={`px-3 py-1 rounded-md transition-all ${
                stagnantTab === '12' ? 'bg-[#8b1515] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12+ Months Unsold
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: 18 Selected Stagnant SKUs */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                18 Selected Stagnant Festive SKUs (Ready for 60% Clearance)
              </span>
              <span className="text-slate-500 font-semibold">Selected Total: ₹78,200</span>
            </div>

            {/* Grid of 4 Cards dynamically loaded from products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayStagnant.map((product) => {
                const isSelected = selectedItems.includes(product.id);
                const discountPercent =
                  product.price > product.discountPrice
                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                    : 60;
                return (
                  <div
                    key={product.id}
                    onClick={() => toggleItemSelection(product.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 relative ${
                      isSelected
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-12 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-5">
                      <h4 className="font-bold text-xs text-slate-800 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Stock: {product.totalStock} pcs • SKU: {product.sku}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-black text-xs text-slate-900">
                          ₹{product.discountPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1 rounded">
                          -{discountPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(product);
                        }}
                        className="text-slate-300 hover:text-red-600 p-0.5"
                        title="Delete product from store"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(product.id)}
                        className="text-red-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Showing 4 of 18 marked liquidation items • Auto-bundle discount active</span>
              <button
                onClick={handleSelectAll}
                className="font-bold text-red-700 hover:text-red-800 cursor-pointer"
              >
                Select All 18 Items
              </button>
            </div>
          </div>

          {/* Right Column: Targeted Broadcast Hub (Image 3) */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-800">Targeted Broadcast Hub</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                480 VIP Buyers
              </span>
            </div>

            {/* Audience selection card */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-800">Shubhai & Vaishali High-Spenders</p>
                <p className="text-[11px] text-slate-500">Bought in last 12 mos • Avg order: ₹2,400+</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            </div>

            {/* PREVIEW WHATSAPP MESSAGE (BILINGUAL) - styled like Image 3 */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                PREVIEW WHATSAPP MESSAGE (BILINGUAL)
              </p>
              <div className="bg-[#e7f7ee] border border-emerald-200 rounded-xl p-3 text-xs leading-relaxed text-slate-800 font-sans shadow-inner">
                <p className="font-semibold text-emerald-900">
                  नमस्ते! रूपेश वस्त्रालय शुभाई का स्पेशल क्लीयरेंस ऑफर — फ्लैट 60% छूट सिर्फ आपके लिए! ✨
                </p>
                <p className="mt-1 text-slate-700 text-[11px]">
                  प्रिय ग्राहक, शादी व त्योहार के चुनिंदा बनारसी सिल्क, लहंगे और कुर्ते अब स्पेशल सेल में उपलब्ध हैं। हमारे शुभाई चौक स्थित स्टोर पर आएं या 24 घंटे में होम डिलीवरी पाएं।
                </p>
                <p className="mt-1 text-emerald-800 font-bold text-[11px]">
                  👉 कैटलॉग देखने और 3.2km फ्री होम डिलीवरी के लिए 'BUY' रिप्लाई करें।
                </p>
              </div>
            </div>

            {/* Metric counters (Image 3) */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-base font-black text-slate-900">480</div>
                <div className="text-[10px] text-slate-500">Sent</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-base font-black text-slate-900">472</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Delivered (98%)</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-base font-black text-slate-900">64</div>
                <div className="text-[10px] text-slate-500">Inquiries</div>
              </div>
            </div>

            {/* Notification alert if just sent */}
            {broadcastSentNotification && (
              <div className="p-2 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-xs text-center font-bold animate-bounce">
                ✓ WhatsApp broadcast dispatched to 480 VIP customers!
              </div>
            )}

            {/* Send WhatsApp Broadcast Button */}
            <div className="flex gap-2">
              <button
                onClick={handleSendBroadcast}
                disabled={isSendingBroadcast}
                className="flex-1 bg-[#0f6f43] hover:bg-[#0c5936] text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingBroadcast ? 'Sending Broadcast...' : '⚡ Send WhatsApp Broadcast Now'}</span>
              </button>
              <button
                onClick={() => setAdminTab('whatsapp')}
                className="w-10 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600"
                title="Edit Template"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE ORDER WORKFLOW PIPELINE (Exact structure from Image 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Live Order Workflow Pipeline
            </h2>
            <span className="bg-[#b91c1c] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              12 New Awaiting Action
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">FILTER:</span>
            <button
              onClick={() => setOrderFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                orderFilter === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (142)
            </button>
            <button
              onClick={() => setOrderFilter('5KM')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                orderFilter === '5KM'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Shubhai 5km (108)
            </button>
            <button
              onClick={() => setOrderFilter('COD')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                orderFilter === 'COD'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              COD Orders (48)
            </button>
            <button
              onClick={() => setOrderFilter('WHATSAPP')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                orderFilter === 'WHATSAPP'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              WhatsApp Initiated (74)
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 -mt-2">
          Instant 5km delivery verification, WhatsApp invoice sync & GST billing handover.
        </p>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Order ID & Date</th>
                <th className="py-2.5 px-3">Customer Details</th>
                <th className="py-2.5 px-3">Cart Items & Qty</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Delivery Eligibility</th>
                <th className="py-2.5 px-3">Workflow Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.slice(0, 4).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Order ID & Date */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-red-700 block">{order.id}</span>
                    <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                  </td>

                  {/* Customer Details */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      {order.customerPhone.slice(0, 8)} XXXXX
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      📞 ({order.deliveryAddress.locality})
                    </span>
                  </td>

                  {/* Cart Items & Qty */}
                  <td className="py-3 px-3">
                    <span className="text-slate-800 font-medium block">
                      {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      SKU: {order.items.map((i) => i.variantSku).join(', ')}
                    </span>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-3">
                    <span className="font-black text-slate-900 text-sm block">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {order.deliveryFee === 0 ? 'Free Delivery Applied' : `+ ₹${order.deliveryFee} Courier`}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-3">
                    {order.paymentMethod === 'COD' ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        💵 COD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        ✓ UPI Verified
                      </span>
                    )}
                  </td>

                  {/* Delivery Eligibility */}
                  <td className="py-3 px-3">
                    {order.deliveryEligibility.isEligible ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{order.deliveryEligibility.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{order.deliveryEligibility.label}</span>
                      </span>
                    )}
                  </td>

                  {/* Workflow Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide inline-block ${
                        order.orderStatus === 'NEW'
                          ? 'bg-red-600 text-white'
                          : order.orderStatus === 'CONFIRMED'
                          ? 'bg-amber-500 text-stone-950'
                          : order.orderStatus === 'PROCESSING'
                          ? 'bg-blue-600 text-white'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-bold outline-none focus:border-red-600"
                    >
                      <option value="NEW">New</option>
                      <option value="CONFIRMED">Confirm</option>
                      <option value="PROCESSING">Process</option>
                      <option value="SHIPPED">Ship (5km)</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancel (Restore Stock)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar (Image 3) */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <span>Showing 1 to 4 of 142 total orders recorded today</span>
          <div className="flex items-center gap-1 font-bold">
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600">
              Previous
            </button>
            <button className="w-7 h-7 rounded bg-[#8b1515] text-white flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">
              2
            </button>
            <button className="w-7 h-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">
              3
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 4. LOCAL 5KM DELIVERY GEO-FENCE ENGINE (Exact structure from Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Radius Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Local 5km Delivery Geo-Fence Engine</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Center Origin: Shubhai Chowk Flagship Store, Shubhai (PIN 844102)
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Active Geo-Fence
            </span>
          </div>

          {/* Slider: Delivery Radius Limit */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Delivery Radius Limit</span>
              <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-black text-slate-900">
                {radiusSlider.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={radiusSlider}
              onChange={(e) => setRadiusSlider(parseFloat(e.target.value))}
              className="w-full accent-[#8b1515] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 km (Chowk only)</span>
              <span className="font-bold text-red-700">5 km (Full Town)</span>
              <span>15 km (Vaishali rural)</span>
            </div>
          </div>

          {/* Input: Free Delivery Min Order */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-xs text-slate-800">Free Delivery Min. Order</p>
              <p className="text-[10px] text-slate-500">Orders below threshold charged nominal ₹40 delivery fee</p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
              <span className="text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={minOrderInput}
                onChange={(e) => setMinOrderInput(parseInt(e.target.value) || 0)}
                className="w-16 text-xs font-black text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Toggle: Instant Delivery OTP Verification */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-xs text-slate-800">Instant Delivery OTP Verification</p>
              <p className="text-[10px] text-slate-500">Center Origin: Shubhai Chowk Flagship Store, Shubhai (PIN 844102)</p>
            </div>
            <button
              onClick={() => setOtpToggle(!otpToggle)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                otpToggle ? 'bg-[#0f6f43]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  otpToggle ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle: Delivery Under 24 Hrs Promise */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-xs text-slate-800">Delivery Under 24 Hrs of Purchasing Promise</p>
              <p className="text-[10px] text-slate-500">Center Origin: Shubhai Chowk Flagship Store, Shubhai (PIN 844102)</p>
            </div>
            <button
              onClick={() => setPromise24HrToggle(!promise24HrToggle)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                promise24HrToggle ? 'bg-[#8b1515]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  promise24HrToggle ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-mono">
              Coordinates: 25.6859° N, 85.2155° E (Shubhai Hub)
            </span>
            <button
              onClick={handleSaveGeoFence}
              className="bg-[#8b1515] hover:bg-red-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {geoSavedSuccess ? '✓ Rules Saved!' : 'Save Geo-Fence Rules'}
            </button>
          </div>
        </div>

        {/* Right Column: Delivery Coverage Visualizer (Image 3) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs text-slate-800">Delivery Coverage Visualizer</span>
            <span className="text-[10px] font-bold text-slate-500">14 Active Delivery Boys</span>
          </div>

          {/* Interactive Radar Visualizer Schematic */}
          <div className="relative w-full h-56 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
            {/* Outer circle (15km) */}
            <div className="absolute w-48 h-48 rounded-full border border-dashed border-slate-300 animate-[spin_60s_linear_infinite]" />
            {/* Middle circle (5km) */}
            <div className="absolute w-32 h-32 rounded-full border-2 border-emerald-400 bg-emerald-500/5 flex items-center justify-center">
              <span className="absolute -top-3 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                5km Limit
              </span>
            </div>
            {/* Inner circle (1km) */}
            <div className="absolute w-16 h-16 rounded-full border border-amber-300 bg-amber-400/10" />

            {/* Center Store Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-[#b91c1c] text-white flex items-center justify-center font-bold text-xs shadow-md">
                🏛️
              </div>
              <span className="text-[9px] font-black text-slate-800 mt-1 bg-white/90 px-1 rounded shadow-xs">
                Rupesh Vastralaya
              </span>
            </div>

            {/* Rider Pin #4: Rajendra Chowk */}
            <div className="absolute top-8 right-12 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm animate-pulse">
              <span>🛵</span>
              <span>Rider #4 (Rajendra Chowk)</span>
            </div>

            {/* Rider Pin #9: Industrial Area */}
            <div className="absolute bottom-8 right-14 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm">
              <span>🛵</span>
              <span>Rider #9 (Industrial Area)</span>
            </div>
          </div>

          {/* Shubhai & Vaishali Express Handover Badge */}
          <div className="bg-[#e7f7ee] border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-emerald-950">
                Shubhai & Vaishali Express Handover Badge
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                "Express Delivery in Shubhai & Vaishali (Within 5km) • Delivery under 24 hrs of purchasing"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Avg delivery fulfillment time: <strong className="text-slate-800 font-bold">42 mins</strong></span>
            <button
              onClick={() => setAdminTab('delivery')}
              className="font-bold text-red-700 hover:text-red-800 cursor-pointer"
            >
              Manage Riders
            </button>
          </div>
        </div>
      </div>

      {/* In-app Delete Confirmation Modal */}
      <DeleteProductConfirmModal
        product={productToDelete}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={(id) => {
          const target = products.find((p) => p.id === id);
          deleteProduct(id);
          setDeleteSuccessToast(`"${target?.name || 'Product'}" has been deleted from store.`);
          setTimeout(() => setDeleteSuccessToast(null), 4000);
        }}
      />
    </div>
  );
};
