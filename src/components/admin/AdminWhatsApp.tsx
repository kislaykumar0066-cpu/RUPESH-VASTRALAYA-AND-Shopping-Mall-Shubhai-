import React, { useState } from 'react';
import {
  Radio,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Users,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { whatsappService } from '../../services/whatsappService';

export const AdminWhatsApp: React.FC = () => {
  const { whatsappLogs, whatsappCampaigns, sendOldStockBroadcast, shopSettings } = useStore();
  const [selectedTemplate, setSelectedTemplate] = useState('ORDER_PLACED');
  const [customPhone, setCustomPhone] = useState('9431287612');
  const [testSent, setTestSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isMock = whatsappService.isMockMode();

  const handleSendTestMessage = async () => {
    setIsSending(true);
    await whatsappService.sendMessage({
      toPhone: customPhone,
      customerName: 'Shubhai Patron',
      template: selectedTemplate as any,
      variables: {
        customerName: 'Shubhai Patron',
        orderId: 'RV-8421',
        totalAmount: 3450,
        paymentMethod: 'COD',
        itemsSummary: '2x Banarasi Saree, 1x Cotton Kurti',
        riderName: 'Rakesh Kumar (Shubhai Rider #4)',
        otp: '4892',
      },
    });
    setIsSending(false);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with MOCK MODE disclosure as required by prompt */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Automation & Campaign Engine</span>
            </h2>
            {isMock ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                ⚙️ MOCK MODE ACTIVE
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                ⚡ META GRAPH API LIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMock
              ? 'External WhatsApp credentials not configured in development environment. Simulator active (no billing charges incurred).'
              : 'Connected to official Meta WhatsApp Cloud API endpoint.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <p className="font-bold text-slate-800">Phone ID: {shopSettings.whatsapp}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">98.2% Delivery Health</p>
          </div>
        </div>
      </div>

      {/* Grid: Templates & Quick Dispatch Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Template Simulator */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Configured Automation Templates</h3>

          <div className="space-y-2">
            {[
              {
                id: 'ORDER_PLACED',
                title: '1. Order Placed Notification',
                desc: 'Dispatched immediately when customer places order (COD or Prepaid).',
              },
              {
                id: 'ORDER_CONFIRMED',
                title: '2. Order Confirmed & Packing',
                desc: 'Sent when storekeeper reviews & confirms inventory.',
              },
              {
                id: 'ORDER_SHIPPED',
                title: '3. Order Out for 5km Delivery',
                desc: 'Includes assigned delivery boy contact & secure OTP.',
              },
              {
                id: 'ORDER_DELIVERED',
                title: '4. Order Handover Complete',
                desc: 'Thank you note & delivery confirmation.',
              },
              {
                id: 'REVIEW_REQUEST',
                title: '5. Review Request (After 1 Day)',
                desc: 'Follow-up asking for 1–5 star rating on purchased items.',
              },
              {
                id: 'OLD_STOCK_OFFER',
                title: '6. Old Stock Festive Clearance Offer',
                desc: 'Sent to VIP opted-in buyers with 60% discount code.',
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplate === t.id
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{t.title}</span>
                  {selectedTemplate === t.id && (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          {/* Quick test sender */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-xs text-slate-800">Test Dispatch to Phone</h4>
            <div className="flex gap-2">
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                onClick={handleSendTestMessage}
                disabled={isSending}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Sending...' : 'Send Test'}</span>
              </button>
            </div>
            {testSent && (
              <p className="text-xs text-emerald-700 font-bold">
                ✓ Message successfully recorded to dispatch log!
              </p>
            )}
          </div>
        </div>

        {/* Right: Message Dispatch Logs */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Recent Message Log Stream</h3>
              <span className="text-[10px] text-slate-400 font-mono">Live WebSocket Sink</span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {whatsappLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {log.recipientName} ({log.recipientPhone})
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-100 whitespace-pre-line font-sans">
                    {log.content}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Template: {log.templateName}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
