import React, { useState } from 'react';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Phone,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Heart,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductVariant } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
    wishlist,
    toggleWishlist,
    checkDelivery,
    reviews,
    addReview,
    shopSettings,
  } = useStore();

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isWishlisted = wishlist.includes(product.id);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      sku: product.sku,
      size: 'Standard',
      color: 'Standard',
      stock: product.totalStock,
    }
  );

  // Delivery check state
  const [pincodeQuery, setPincodeQuery] = useState('844102');
  const [deliveryResult, setDeliveryResult] = useState(() => checkDelivery('844102'));

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeQuery.trim()) return;
    const res = checkDelivery(pincodeQuery);
    setDeliveryResult(res);
  };

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant.id, 1);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (selectedVariant.stock <= 0) return;
    addToCart(product, selectedVariant.id, 1);
    setActiveProductModal(null);
    setIsCheckoutModalOpen(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `नमस्ते रूपेश वस्त्रालय!\nमुझे यह साड़ी/वस्त्र खरीदना है:\n*${product.name}*\nसाइज़: ${selectedVariant.size}\nरंग: ${selectedVariant.color}\nमूल्य: ₹${product.discountPrice}\nSKU: ${selectedVariant.sku}\nकृपया शुभाई चौक स्टोर से 24 घंटे में डिलीवरी की जानकारी दें।`
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${text}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    addReview({
      productId: product.id,
      customerName: reviewerName.trim(),
      customerMobile: 'Verified Customer',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewComment('');
    setReviewerName('');
    setShowReviewForm(false);
  };

  const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx ? 'border-red-600 ring-2 ring-red-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Variant Selection */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Category, Brand, SKU */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-bold text-red-700 uppercase tracking-wider">{product.brand}</span>
                <span>•</span>
                <span>{product.subcategory}</span>
                <span>•</span>
                <span className="text-slate-400 font-mono">SKU: {selectedVariant.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>
              {product.hindiName && (
                <p className="text-sm font-semibold text-slate-600 mt-0.5">{product.hindiName}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {product.reviewCount} Ratings & {productReviews.length} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3 pb-3 border-b border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-emerald-600">Save ₹{product.price - product.discountPrice}</span>
              </div>

              {/* Size & Color Variants */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Size: <span className="text-red-700 font-semibold">{selectedVariant.size}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant.id === v.id;
                      const hasStock = v.stock > 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          disabled={!hasStock}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50 text-red-800 ring-2 ring-red-400/50'
                              : hasStock
                              ? 'border-slate-300 hover:border-slate-400 text-slate-700'
                              : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {v.size} {v.color && `(${v.color})`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock Warning */}
                <div className="flex items-center gap-2 text-xs">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock ({selectedVariant.stock} items ready at Shubhai Chowk)
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Currently Out of Stock in this size
                    </span>
                  )}
                </div>
              </div>

              {/* 5km Local Delivery Pincode Checker */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-red-700" />
                    Delivery Eligibility from Shubhai Chowk (5 km Radius)
                  </span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={pincodeQuery}
                      onChange={(e) => setPincodeQuery(e.target.value)}
                      placeholder="e.g. 844102 or Hajipur locality"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-red-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Check
                  </button>
                </form>

                {deliveryResult && (
                  <div
                    className={`text-xs p-2 rounded-lg font-medium flex items-start gap-2 ${
                      deliveryResult.isWithinRadius
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{deliveryResult.badgeText}</p>
                      <p className="text-[11px] mt-0.5">{deliveryResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Specifications */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Product Details & Specifications
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Fabric Material</span>
                    <span className="font-bold text-slate-800">{product.fabric}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Authentic Brand</span>
                    <span className="font-bold text-slate-800">{product.brand}</span>
                  </div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Customer Reviews ({productReviews.length})
                  </h4>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-bold text-red-700 hover:text-red-800"
                  >
                    {showReviewForm ? 'Cancel' : '+ Write a Review'}
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-red-50/50 p-3 rounded-xl border border-red-100 space-y-2 mb-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar (Hajipur)"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setReviewRating(num)}
                            className="p-1 text-amber-500"
                          >
                            <Star className={`w-4 h-4 ${reviewRating >= num ? 'fill-amber-500' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Review Details</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Share your experience with the fabric and fitting..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs outline-none focus:border-red-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded text-xs"
                    >
                      Submit Review
                    </button>
                  </form>
                )}

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{rev.customerName}</span>
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            {rev.rating} <Star className="w-2.5 h-2.5 fill-amber-500" />
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No reviews yet for this product. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions CTA */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock <= 0}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={selectedVariant.stock <= 0}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-red-700 hover:bg-red-800 text-white flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <span>Buy Now (Express)</span>
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
