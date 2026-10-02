import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  ArrowRight,
  Phone,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { LOCAL_AREAS } from '../../lib/constants';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartTotal,
    createOrder,
    checkDelivery,
    currentCustomer,
  } = useStore();

  if (!isCheckoutModalOpen) return null;

  // Multi-step: 1 = Address & 5km check, 2 = OTP verify, 3 = Payment & confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState(currentCustomer?.name || 'Ramesh Kumar');
  const [mobile, setMobile] = useState(currentCustomer?.mobile || '9431287612');
  const [whatsappNumber, setWhatsappNumber] = useState(currentCustomer?.whatsapp || '9431287612');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState(currentCustomer?.email || 'customer@gmail.com');
  const [addressLine, setAddressLine] = useState('Near Durga Mandir, Shubhai Main Chowk');
  const [locality, setLocality] = useState('Shubhai Chowk / Main Market');
  const [pincode, setPincode] = useState('844102');
  const [notes, setNotes] = useState('Please call before delivery');

  // Delivery check state
  const [deliveryResult, setDeliveryResult] = useState(() => checkDelivery(pincode));

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [otpInput, setOtpInput] = useState('5821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.length >= 4) {
      setDeliveryResult(checkDelivery(val));
    }
  };

  const handleLocalitySelect = (areaName: string) => {
    const area = LOCAL_AREAS.find((a) => a.name === areaName);
    if (area) {
      setLocality(area.name);
      setPincode(area.pincode);
      setDeliveryResult(checkDelivery(area.name));
    }
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !addressLine.trim()) {
      setErrorMessage('Please fill in all mandatory delivery fields');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim().length !== 4) {
      setErrorMessage('Please enter valid 4-digit OTP (e.g. 5821)');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleFinalOrderSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const finalWhatsapp = sameAsMobile ? mobile : whatsappNumber;
      const result = await createOrder({
        customerName: fullName,
        customerPhone: mobile,
        customerWhatsapp: finalWhatsapp,
        customerEmail: email,
        deliveryAddress: {
          fullName,
          mobile,
          whatsappNumber: finalWhatsapp,
          email,
          addressLine,
          locality,
          pincode,
          city: 'Hajipur',
          state: 'Bihar',
          distanceKm: deliveryResult.distanceKm,
          isWithin5km: deliveryResult.isWithinRadius,
          notes,
        },
        paymentMethod,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to place order');
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        setIsCheckoutModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const deliveryFee = deliveryResult.isWithinRadius ? 0 : 80;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Safe & Express Garment Checkout
            </h2>
            <p className="text-xs text-slate-500">
              Rupesh Vastralaya Flagship Store • Shubhai Chowk, Hajipur
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 text-center text-xs font-bold border-b border-slate-100 bg-white">
          <div
            className={`py-2.5 border-b-2 transition-colors ${
              step === 1 ? 'border-red-700 text-red-700 bg-red-50/40' : 'border-transparent text-slate-400'
            }`}
          >
            1. Address & 5km Radius
          </div>
          <div
            className={`py-2.5 border-b-2 transition-colors ${
              step === 2 ? 'border-red-700 text-red-700 bg-red-50/40' : 'border-transparent text-slate-400'
            }`}
          >
            2. Mobile OTP
          </div>
          <div
            className={`py-2.5 border-b-2 transition-colors ${
              step === 3 ? 'border-red-700 text-red-700 bg-red-50/40' : 'border-transparent text-slate-400'
            }`}
          >
            3. Payment & Confirm
          </div>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* STEP 1: Delivery Address & 5km Radius Check */}
          {step === 1 && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Number (for Delivery OTP) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* WhatsApp notification field */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => setSameAsMobile(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Send order updates, tracking & GST bill to same WhatsApp number</span>
                </label>
                {!sameAsMobile && (
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Enter WhatsApp Number"
                    className="mt-2 w-full bg-white border border-emerald-300 rounded-lg p-1.5 text-xs outline-none"
                  />
                )}
              </div>

              {/* Locality Quick Selector in Hajipur */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Vaishali / Hajipur Locality (or enter below)
                </label>
                <select
                  value={locality}
                  onChange={(e) => handleLocalitySelect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600"
                >
                  {LOCAL_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} (PIN {a.pincode} • {a.distanceKm} km from Shubhai Chowk)
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Line & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Street Address / House / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House no., Near Temple, Road name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="844102"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Delivery 5km Validation Result Box */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  deliveryResult.isWithinRadius
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <Truck className="w-5 h-5 shrink-0 mt-0.5 text-red-700" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{deliveryResult.badgeText}</span>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded border">
                      {deliveryResult.isWithinRadius ? 'FREE 24-Hr Delivery' : '+ ₹80 Courier'}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 text-slate-700">{deliveryResult.message}</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Mobile OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-base">Verify Mobile Number</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We sent a 4-digit delivery security code to{' '}
                  <span className="font-bold text-slate-800">+91 {mobile}</span>
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="5821"
                  className="w-full text-center text-2xl tracking-[0.5em] font-black bg-slate-50 border-2 border-red-300 focus:border-red-600 rounded-xl py-3 outline-none"
                />
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  (Demo OTP auto-filled: <span className="font-bold text-red-700">5821</span>)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-red-700 hover:bg-red-800 text-white font-extrabold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Verify & Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment Method & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Choose Payment Mode</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-400/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-red-700" />
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Fastest
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">Instant UPI</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">PhonePe / Google Pay / Paytm QR</p>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-400/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-amber-700" />
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Pay at Door
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pay cash to delivery boy</p>
                </button>

                {/* Razorpay Gateway */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-400/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-blue-700" />
                    <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      Cards / NetBanking
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">Razorpay</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Debit/Credit cards & EMI</p>
                </button>
              </div>

              {/* Payment Detail Simulation Box */}
              {paymentMethod === 'UPI' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Scan & Pay via any UPI App</p>
                    <p className="text-[11px] text-slate-500">UPI ID: 6206875074@ybl (Rupesh Vastralaya)</p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Zero extra transaction fee
                    </p>
                  </div>
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Cart Items ({cart.length})</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({deliveryResult.distanceKm} km from Shubhai)</span>
                  <span>{deliveryFee === 0 ? 'FREE (5km Policy)' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalOrderSubmit}
                  className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isProcessing ? (
                    <span>Confirming Order & Stock...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{grandTotal})</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
