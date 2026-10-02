import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartItemsCount,
    setIsCheckoutModalOpen,
    setSelectedCategory,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-slate-800">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-700" />
            <h2 className="font-black text-slate-900 text-base">
              My Shopping Cart ({cartItemsCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Local Delivery Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-2.5 px-4 flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>⚡ Free 24-hr Express Delivery within 5 km of Shubhai Chowk!</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700 text-sm">Your cart is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our authentic Banarasi sarees, wedding kurtis, and men's festive collections.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setSelectedCategory('saree');
                }}
                className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs"
              >
                Browse Sarees & Apparel
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="py-3 flex gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Size: <span className="font-semibold text-slate-700">{item.variant.size}</span>
                      {item.variant.color && ` • ${item.variant.color}`}
                    </p>
                    <p className="font-black text-xs text-slate-900 mt-1">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-md">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.variant.stock}
                        className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItemsCount} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>5km Local Garment Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Safe & Secure Indian Garment Delivery • Pay via UPI / COD</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
