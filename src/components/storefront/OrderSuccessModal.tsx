import React from 'react';
import { CheckCircle2, MessageSquare, Truck, Package, Phone, ArrowRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { lastCreatedOrder, setLastCreatedOrder, setCurrentView, setAdminTab } = useStore();

  if (!lastCreatedOrder) return null;

  const order = lastCreatedOrder;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 text-center space-y-4">
        <button
          onClick={() => setLastCreatedOrder(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Order Confirmed!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Order Reference ID: <span className="font-mono font-bold text-red-700">{order.id}</span>
          </p>
        </div>

        {/* WhatsApp Notification Simulator Box */}
        <div className="bg-emerald-950 text-emerald-100 rounded-xl p-4 text-left border border-emerald-800 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 pb-2 border-b border-emerald-800/80 mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Automated WhatsApp Dispatch Preview (Sent to {order.customerWhatsapp})</span>
          </div>
          <p className="text-xs font-sans leading-relaxed text-emerald-50 whitespace-pre-line">
            {`नमस्ते ${order.customerName} जी! 🙏\nरूपेश वस्त्रालय एवं शॉपिंग मॉल, शुभाई चौक से आपका आर्डर #${order.id} प्राप्त हो गया है।\nकुल देय राशि: ₹${order.totalAmount} (${order.paymentMethod})\nडिलीवरी पता: ${order.deliveryAddress.locality}, हाजीपुर\n⚡ 5km के भीतर 24 घंटे में हमारे डिलीवरी राइडर द्वारा सुरक्षित डिलीवरी होगी।`}
          </p>
        </div>

        {/* Delivery Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-red-700" />
              <span>Express Delivery Status</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
              {order.deliveryEligibility.label}
            </span>
          </div>
          <p className="text-slate-600">
            Estimated Delivery Time: <span className="font-bold text-slate-800">Within 24 Hours</span>
          </p>
          <p className="text-slate-600">
            Origin Store: <span className="font-semibold text-slate-700">Flagship Showroom, Shubhai Chowk</span>
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              setLastCreatedOrder(null);
            }}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => {
              setLastCreatedOrder(null);
              setCurrentView('admin');
              setAdminTab('orders');
            }}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View in Admin Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
