import React from 'react';
import { Heart, Star, Truck, ShoppingCart, Phone } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getTranslation } from '../../lib/translations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    addToCart,
    wishlist,
    toggleWishlist,
    setActiveProductModal,
    setIsCartDrawerOpen,
    shopSettings,
    recentlyAddedProductId,
  } = useStore();

  const isWishlisted = wishlist.includes(product.id);
  const isJustAdded = product.id === recentlyAddedProductId;
  const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
  const isOutOfStock = product.totalStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant.id, 1);
    setIsCartDrawerOpen(true);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `नमस्ते रूपेश वस्त्रालय! मुझे यह प्रोडक्ट खरीदना है:\n*${product.name}*\nSKU: ${product.sku}\nऑफर मूल्य: ₹${product.discountPrice}\nकृपया उपलब्धता और डिलीवरी की पुष्टि करें।`
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-[11px] px-2 py-0.5 rounded shadow">
            {discountPercent}% OFF
          </div>
        )}

        {/* Just Added Badge */}
        {isJustAdded && (
          <div className="absolute top-8 left-2 bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-0.5 animate-pulse">
            ✨ Just Added
          </div>
        )}

        {/* Stagnant / Clearance Badge */}
        {product.isStagnant && !isJustAdded && (
          <div className="absolute top-8 left-2 bg-amber-500 text-stone-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow uppercase tracking-wide">
            Special Clearance
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors shadow-sm"
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-600 fill-red-600' : ''}`} />
        </button>

        {/* Stock warning pill if low */}
        {product.totalStock > 0 && product.totalStock <= 4 && (
          <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Only {product.totalStock} Left!
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Fabric */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-600 truncate">{product.brand}</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] shrink-0">
              {product.fabric}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
            {language === 'hi' && product.hindiName ? product.hindiName : product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Price section */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{product.discountPrice.toLocaleString('en-IN')}
            </span>
            {product.price > product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* 5km Local Delivery Pill */}
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Free 24-hr delivery within 5 km</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1 transition-colors shadow-xs"
            title="Order directly via WhatsApp"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
