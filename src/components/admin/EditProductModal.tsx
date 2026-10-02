import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types';
import { AIImageGeneratorModal } from './AIImageGeneratorModal';
import { ProductImageCaptureAndEnhance } from './ProductImageCaptureAndEnhance';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { editProduct } = useStore();

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState('saree');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [discountPrice, setDiscountPrice] = useState('0');
  const [fabric, setFabric] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setHindiName(product.hindiName || '');
      setCategory(product.category);
      setSubcategory(product.subcategory);
      setDescription(product.description);
      setPrice(product.price.toString());
      setDiscountPrice(product.discountPrice.toString());
      setFabric(product.fabric);
      setBrand(product.brand);
      setSku(product.sku);
      setImageUrl(product.images[0] || '');
      setVariants(
        product.variants.map((v) => ({ ...v }))
      );
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}`,
        sku: `${sku}-${Date.now().toString().slice(-4)}`,
        size: 'Free Size',
        color: 'Standard',
        stock: 5,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, val: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

    editProduct(product.id, {
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      category,
      subcategory: subcategory.trim() || 'Festive Garments',
      description: description.trim(),
      price: parseFloat(price) || 0,
      discountPrice: parseFloat(discountPrice) || 0,
      fabric: fabric.trim() || 'Silk',
      brand: brand.trim() || 'Rupesh Vastralaya',
      sku: sku.trim(),
      images: [imageUrl, ...(product.images.slice(1) || [])],
      variants,
      totalStock,
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-700" />
                <span>Edit Product Details (SKU: {product.sku})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Update prices, fabric specs, stock counts, and AI photography.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hindi Title (Optional)</label>
                <input
                  type="text"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600"
                >
                  <option value="saree">Saree</option>
                  <option value="kurti">Kurti</option>
                  <option value="ladies">Ladies Wear</option>
                  <option value="gents">Gents Wear</option>
                  <option value="shirt">Shirt</option>
                  <option value="t-shirt">T-shirt</option>
                  <option value="jeans">Jeans</option>
                  <option value="children">Children Wear</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Fabric Material</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Original MRP (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Discount Offer Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white font-bold text-red-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Product Image Capture & Professional Catalog AI Enhancer */}
            <ProductImageCaptureAndEnhance
              currentImageUrl={imageUrl}
              onImageChange={(url) => setImageUrl(url)}
              category={category}
              title={name}
              fabric={fabric}
              color={variants[0]?.color || 'Red'}
            />

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Product Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-red-600 focus:bg-white"
              />
            </div>

            {/* Variants Matrix */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Size & Stock Variants
                </label>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-2">
                {variants.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleUpdateVariant(v.id, 'size', e.target.value)}
                      placeholder="Size"
                      className="w-24 bg-white border border-slate-300 rounded p-1 text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleUpdateVariant(v.id, 'color', e.target.value)}
                      placeholder="Color"
                      className="w-24 bg-white border border-slate-300 rounded p-1 text-xs outline-none"
                    />
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(v.id, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="Stock pcs"
                      className="w-20 bg-white border border-slate-300 rounded p-1 text-xs outline-none font-bold"
                    />
                    <span className="text-[10px] text-slate-400 font-mono flex-1 truncate">{v.sku}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#b91c1c] hover:bg-red-800 text-white font-extrabold rounded-xl text-xs shadow-md"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* AI Image Generator Modal */}
      <AIImageGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectImage={(url) => setImageUrl(url)}
        category={category}
        title={name}
        fabric={fabric}
        color={variants[0]?.color || 'Red'}
      />
    </>
  );
};
