import { ShopSettings } from '../types';

export const SHOP_DEFAULTS: ShopSettings = {
  shopId: 'shop-rupesh-hajipur-01',
  name: 'Rupesh Vastralaya & Shopping Mall',
  tagline: 'Leading Family Garment & Saree Showroom in Vaishali District',
  location: 'Shubhai Chowk, Mahua Road, Hajipur, Vaishali, Bihar – 844102',
  pincode: '844102',
  phone: '6206875074',
  whatsapp: '6206875074',
  gstin: '10AAACR8421K1ZP',
  centerLat: 25.6859,
  centerLng: 85.2155,
  deliveryRadiusKm: 5.0,
  freeDeliveryMinOrder: 999,
  instantDeliveryOtpRequired: true,
  delivery24HrPromise: true,
  currencySymbol: '₹',
  subscriptionPlan: 'TRIAL',
  trialDaysRemaining: 4,
  trialExpiresAt: '2026-10-06T23:59:59Z',
  mockMode: true,
};

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', hi: 'सभी श्रेणियां', hinglish: 'Sabhi Categories' },
  { id: 'ladies', name: 'Ladies', hi: 'महिलाएं', hinglish: 'Ladies Wear', icon: 'Sparkles' },
  { id: 'saree', name: 'Saree', hi: 'साड़ी', hinglish: 'Saree Collection', icon: 'Flame' },
  { id: 'kurti', name: 'Kurti', hi: 'कुर्ती', hinglish: 'Designer Kurti', icon: 'Shirt' },
  { id: 'gents', name: 'Gents', hi: 'पुरुष', hinglish: 'Gents Wear', icon: 'User' },
  { id: 'shirt', name: 'Shirt', hi: 'शर्ट', hinglish: 'Formal & Casual Shirt', icon: 'Layers' },
  { id: 't-shirt', name: 'T-shirt', hi: 'टी-शर्ट', hinglish: 'Polo & Printed T-Shirt', icon: 'Tag' },
  { id: 'jeans', name: 'Jeans', hi: 'जीन्स', hinglish: 'Denim Jeans', icon: 'Scissors' },
  { id: 'children', name: 'Children', hi: 'बच्चे', hinglish: 'Kids & Baby Wear', icon: 'Smile' },
  { id: 'other', name: 'Other', hi: 'अन्य', hinglish: 'Dupatta, Shawl & More', icon: 'Package' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const FABRICS = [
  'Banarasi Silk',
  'Pure Cotton',
  'Chanderi Silk',
  'Georgette',
  'Rayon',
  'Denim',
  'Jacquard',
  'Linen',
];

export const COLORS = [
  { name: 'Red', hex: '#DC2626' },
  { name: 'Maroon', hex: '#831843' },
  { name: 'Golden/Yellow', hex: '#D97706' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Navy Blue', hex: '#1E293B' },
  { name: 'Pink', hex: '#DB2777' },
  { name: 'Black', hex: '#0F172A' },
  { name: 'White', hex: '#F8FAFC' },
];

// Local Vaishali / Hajipur known areas and approximate distance from Shubhai Chowk
export const LOCAL_AREAS = [
  { name: 'Shubhai Chowk / Main Market', pincode: '844102', distanceKm: 0.5, within5km: true },
  { name: 'Mahua Road (Near Store)', pincode: '844102', distanceKm: 1.2, within5km: true },
  { name: 'Anjanpir Chowk, Hajipur', pincode: '844101', distanceKm: 2.1, within5km: true },
  { name: 'Rajendra Chowk, Hajipur', pincode: '844101', distanceKm: 3.2, within5km: true },
  { name: 'Subhash Chowk, Hajipur', pincode: '844101', distanceKm: 3.6, within5km: true },
  { name: 'Lalganj Road Bypass', pincode: '844101', distanceKm: 4.8, within5km: true },
  { name: 'Hajipur Industrial Area', pincode: '844102', distanceKm: 4.5, within5km: true },
  { name: 'Mahua Market Center', pincode: '844122', distanceKm: 12.0, within5km: false },
  { name: 'Lalganj Bazaar', pincode: '844121', distanceKm: 14.5, within5km: false },
  { name: 'Vaishali Garh Heritage Area', pincode: '844128', distanceKm: 22.0, within5km: false },
  { name: 'Patna City (Across Gandhi Setu)', pincode: '800001', distanceKm: 18.5, within5km: false },
];
