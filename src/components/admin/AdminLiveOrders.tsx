import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  Phone,
  Printer,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminLiveOrders: React.FC = () => {
  const { orders, updateOrderStatus, shopSettings } = useStore();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeOrderInvoice, setActiveOrderInvoice] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.deliveryAddress.locality.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || o.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-red-600 text-white';
      case 'CONFIRMED':
        return 'bg-amber-500 text-stone-950';
      case 'PROCESSING':
        return 'bg-blue-600 text-white';
      case 'SHIPPED':
        return 'bg-purple-600 text-white';
      case 'DELIVERED':
        return 'bg-emerald-600 text-white';
      case 'CANCELLED':
        return 'bg-slate-400 text-white';
      case 'RETURN_REQUESTED':
        return 'bg-orange-600 text-white';
      case 'REFUNDED':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-700" />
            <span>Store Order Fulfillment Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5km delivery zone verification, automatic inventory deduction, and WhatsApp invoice dispatch.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by order ID, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-red-600 w-52 sm:w-64"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="NEW">New</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Ordered SKUs</th>
                <th className="py-3 px-4">Delivery & Geo</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Status & Pipeline Actions</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Order ID */}
                  <td className="py-3.5 px-4">
                    <span className="font-black text-red-700 text-sm block">{order.id}</span>
                    <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{order.deliveryAddress.locality}</p>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt=""
                            className="w-6 h-8 object-cover rounded shrink-0 border"
                          />
                          <div className="min-w-0 text-[11px]">
                            <p className="font-semibold text-slate-800 truncate">{item.productName}</p>
                            <p className="text-[10px] text-slate-400">
                              Qty: {item.quantity} • {item.size} • SKU: {item.variantSku}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Delivery & Geo */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          order.deliveryEligibility.isEligible
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <Truck className="w-3 h-3 text-red-700" />
                        <span>{order.deliveryEligibility.label}</span>
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {order.deliveryAddress.addressLine}
                      </p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <p className="font-black text-slate-900 text-sm">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '✓ Online UPI'}
                    </p>
                  </td>

                  {/* Status & Transitions */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide inline-block ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      {/* State transition selector */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="block bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-bold text-slate-700 outline-none focus:border-red-600"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONFIRMED">CONFIRM (Ready)</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">DISPATCH (5km Delivery)</option>
                        <option value="DELIVERED">DELIVERED (Handover)</option>
                        <option value="CANCELLED">CANCEL (Auto-Restore Stock)</option>
                      </select>
                    </div>
                  </td>

                  {/* Invoice action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveOrderInvoice(order)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-red-700 transition-colors"
                      title="Print GST Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {activeOrderInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-800">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="font-black text-red-800 text-lg">
                  {shopSettings.name}
                </h3>
                <p className="text-xs text-slate-500">{shopSettings.location}</p>
                <p className="text-[11px] font-semibold text-emerald-800">
                  GSTIN: {shopSettings.gstin}
                </p>
              </div>
              <button
                onClick={() => setActiveOrderInvoice(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs py-2 border-b">
              <div>
                <p className="text-slate-400 text-[10px]">Invoice Number</p>
                <p className="font-bold font-mono">INV-{activeOrderInvoice.id}</p>
                <p className="text-slate-400 text-[10px] mt-1">Date</p>
                <p className="font-semibold">{activeOrderInvoice.createdAt}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Billed To</p>
                <p className="font-bold">{activeOrderInvoice.customerName}</p>
                <p className="text-slate-600">{activeOrderInvoice.deliveryAddress.locality}</p>
                <p className="text-slate-500">{activeOrderInvoice.customerPhone}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-500 text-[10px] uppercase flex justify-between border-b pb-1">
                <span>Item Description</span>
                <span>Amount</span>
              </div>
              {activeOrderInvoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.productName} ({item.size})
                  </span>
                  <span className="font-mono">₹{item.totalPrice}</span>
                </div>
              ))}
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{activeOrderInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (Included @ 5%)</span>
                  <span>₹{Math.round(activeOrderInvoice.subtotal * 0.05)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>5km Express Delivery</span>
                  <span>{activeOrderInvoice.deliveryFee === 0 ? 'FREE' : `₹${activeOrderInvoice.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-black text-base pt-1 border-t text-slate-900">
                  <span>Grand Total</span>
                  <span>₹{activeOrderInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice</span>
              </button>
              <button
                onClick={() => setActiveOrderInvoice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
