import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Product } from '../../types';

interface DeleteProductConfirmModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

export const DeleteProductConfirmModal: React.FC<DeleteProductConfirmModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-slate-800 p-5 sm:p-6 space-y-4">
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">
            Delete Product from Store?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            This will permanently remove the item from your catalogue, customer storefront, and active cart sessions. This action cannot be undone.
          </p>
        </div>

        {/* Product Snapshot Card */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
          />
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              SKU: {product.sku} • Stock: {product.totalStock} pcs
            </p>
            <p className="text-xs font-black text-slate-800 mt-0.5">
              ₹{product.discountPrice.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(product.id);
              onClose();
            }}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Delete Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
