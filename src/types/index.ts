export type Language = 'en' | 'hi' | 'hinglish';

export type UserRole = 'customer' | 'shop_admin' | 'super_admin';

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'REFUNDED';

export type PaymentMethod = 'COD' | 'UPI' | 'RAZORPAY' | 'PHONEPE' | 'GPAY' | 'CARD';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'REFUNDED';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'PAYMENT_FAILED' | 'SUSPENDED';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  priceModifier?: number;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  hindiName?: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  fabric: string;
  brand: string;
  rating: number;
  reviewCount: number;
  sku: string;
  variants: ProductVariant[];
  totalStock: number;
  isStagnant?: boolean;
  stagnantMonths?: number;
  stagnantAgeDays?: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface CustomerAddress {
  fullName: string;
  mobile: string;
  whatsappNumber: string;
  email?: string;
  addressLine: string;
  locality: string;
  pincode: string;
  city: string;
  state: string;
  distanceKm: number;
  isWithin5km: boolean;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantSku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string; // e.g. RV-8421
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerEmail?: string;
  deliveryAddress: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryEligibility: {
    distanceKm: number;
    isEligible: boolean;
    label: string; // e.g. "3.2 km • Eligible"
    expressCourier?: boolean;
  };
  otpVerified: boolean;
  whatsappInvoiceSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  locality: string;
  totalOrders: number;
  totalSpend: number;
  lastPurchaseDate: string;
  whatsappMarketingOptIn: boolean;
  isVip?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerMobile: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface WhatsAppMessageLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  direction: 'OUTBOUND' | 'INBOUND';
  isMock: boolean;
  timestamp: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  audienceTag: string;
  recipientCount: number;
  deliveredCount: number;
  inquiryCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'SCHEDULED';
  previewText: string;
  createdAt: string;
}

export interface ShopSettings {
  shopId: string;
  name: string;
  tagline: string;
  location: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  gstin: string;
  centerLat: number;
  centerLng: number;
  deliveryRadiusKm: number;
  freeDeliveryMinOrder: number;
  instantDeliveryOtpRequired: boolean;
  delivery24HrPromise: boolean;
  currencySymbol: string;
  subscriptionPlan: 'TRIAL' | 'PRO_MONTHLY' | 'ENTERPRISE';
  trialDaysRemaining: number;
  trialExpiresAt: string;
  mockMode: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER';
  shopId: string;
}
