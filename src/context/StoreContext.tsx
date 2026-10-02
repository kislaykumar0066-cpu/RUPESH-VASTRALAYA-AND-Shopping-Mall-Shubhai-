import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Customer,
  Review,
  ShopSettings,
  Language,
  OrderStatus,
  PaymentMethod,
  CustomerAddress,
  WhatsAppMessageLog,
  WhatsAppCampaign,
} from '../types';
import { SHOP_DEFAULTS } from '../lib/constants';
import { SEED_PRODUCTS, SEED_ORDERS, SEED_CUSTOMERS, SEED_REVIEWS } from '../data/seedData';
import { validateDeliveryLocation, DeliveryCheckResult } from '../lib/deliveryService';
import { validateOrderStock, decrementStock, restoreStock } from '../lib/stockService';
import { whatsappService } from '../services/whatsappService';
import { paymentService } from '../services/paymentService';

interface StoreContextType {
  // Navigation & View
  currentView: 'storefront' | 'admin' | 'super-admin';
  setCurrentView: (view: 'storefront' | 'admin' | 'super-admin') => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Shop Settings & SaaS
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
  upgradeSubscription: (plan: 'PRO_MONTHLY' | 'ENTERPRISE') => Promise<void>;

  // Products & Inventory
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  adminSearchQuery: string;
  setAdminSearchQuery: (query: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => string;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  applyOldStockDiscount: (productIds: string[], discountPercent: number) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Shopkeeper Wishlist & Targeted Discounts
  shopkeeperWishlist: string[];
  toggleShopkeeperWishlist: (productId: string) => void;
  applyDiscountToProduct: (productId: string, discountPercent: number, newDiscountPrice?: number) => void;
  removeDiscountFromProduct: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp: string;
    customerEmail?: string;
    deliveryAddress: CustomerAddress;
    paymentMethod: PaymentMethod;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Customers & Auth
  currentCustomer: Customer | null;
  setCurrentCustomer: (cust: Customer | null) => void;
  customers: Customer[];
  loginCustomerWithOtp: (mobile: string, otp: string) => boolean;
  logoutCustomer: () => void;

  // Admin Authentication & 15-Minute Inactivity
  isAdminLoggedIn: boolean;
  adminSessionExpired: boolean;
  loginAdmin: (identifier: string, passOrOtp: string) => boolean;
  logoutAdmin: () => void;
  lastAdminActiveTime: number;

  // WhatsApp Automation
  whatsappLogs: WhatsAppMessageLog[];
  whatsappCampaigns: WhatsAppCampaign[];
  sendOldStockBroadcast: (audienceTag: string, productCount: number, discountPercent: number) => Promise<boolean>;

  // Modals & UI State
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  activeEditProduct: Product | null;
  setActiveEditProduct: (prod: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAddSkuModalOpen: boolean;
  setIsAddSkuModalOpen: (open: boolean) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
  recentlyAddedProductId: string | null;
  setRecentlyAddedProductId: (id: string | null) => void;

  // Delivery check helper
  checkDelivery: (query: string) => DeliveryCheckResult;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<'storefront' | 'admin' | 'super-admin'>('storefront');
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [language, setLanguage] = useState<Language>('en');

  // Shop settings
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('rupesh_shop_settings');
    return saved ? JSON.parse(saved) : SHOP_DEFAULTS;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rupesh_products');
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rupesh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rupesh_wishlist');
    return saved ? JSON.parse(saved) : ['prod-01', 'prod-05'];
  });

  // Shopkeeper's specific promotional wishlist for adding discounts or deleting items
  const [shopkeeperWishlist, setShopkeeperWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rupesh_shopkeeper_wishlist');
    return saved ? JSON.parse(saved) : ['prod-01', 'prod-02', 'prod-03'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rupesh_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('rupesh_customers');
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rupesh_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  // WhatsApp
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppMessageLog[]>(() => whatsappService.getLogs());
  const [whatsappCampaigns, setWhatsappCampaigns] = useState<WhatsAppCampaign[]>([
    {
      id: 'camp-festive-01',
      title: 'Shubhai Festive Clearance Blast',
      audienceTag: 'Shubhai & Vaishali High-Spenders',
      recipientCount: 480,
      deliveredCount: 472,
      inquiryCount: 64,
      status: 'ACTIVE',
      previewText: 'नमस्ते! रूपेश वस्त्रालय शुभाई का स्पेशल क्लीयरेंस ऑफर...',
      createdAt: 'Today, 10:00 AM',
    },
  ]);

  // Modals & UI
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeEditProduct, setActiveEditProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [recentlyAddedProductId, setRecentlyAddedProductId] = useState<string | null>(null);

  // Admin Authentication & 15-Minute Inactivity Auto-Logout
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes = 900,000 ms

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('rupesh_admin_logged_in') === 'true';
  });
  const [adminSessionExpired, setAdminSessionExpired] = useState<boolean>(false);
  const [lastAdminActiveTime, setLastAdminActiveTime] = useState<number>(() => {
    const saved = sessionStorage.getItem('rupesh_admin_last_active');
    return saved ? parseInt(saved, 10) : Date.now();
  });

  const loginAdmin = (identifier: string, passOrOtp: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanSecret = passOrOtp.trim();

    if (
      (cleanId === 'admin@rupeshvastralaya.com' && cleanSecret === 'admin123') ||
      (cleanId.includes('6206875074') && cleanSecret === '1234') ||
      cleanSecret === 'admin123' ||
      cleanSecret === '1234'
    ) {
      setIsAdminLoggedIn(true);
      setAdminSessionExpired(false);
      const now = Date.now();
      setLastAdminActiveTime(now);
      sessionStorage.setItem('rupesh_admin_logged_in', 'true');
      sessionStorage.setItem('rupesh_admin_last_active', now.toString());
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('rupesh_admin_logged_in');
  };

  // Activity tracking for 15-minute timeout
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let lastRecord = Date.now();
    const recordActivity = () => {
      const now = Date.now();
      // Throttle state update to at most once per 3 seconds
      if (now - lastRecord > 3000) {
        lastRecord = now;
        setLastAdminActiveTime(now);
        sessionStorage.setItem('rupesh_admin_last_active', now.toString());
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    // Check inactivity every 5 seconds
    const interval = setInterval(() => {
      const storedLast = parseInt(sessionStorage.getItem('rupesh_admin_last_active') || '0', 10);
      const effectiveLast = Math.max(lastRecord, storedLast);
      if (Date.now() - effectiveLast >= INACTIVITY_TIMEOUT_MS) {
        logoutAdmin();
        setAdminSessionExpired(true);
      }
    }, 5000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      clearInterval(interval);
    };
  }, [isAdminLoggedIn]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('rupesh_shop_settings', JSON.stringify(shopSettings));
  }, [shopSettings]);

  useEffect(() => {
    localStorage.setItem('rupesh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rupesh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rupesh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rupesh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rupesh_shopkeeper_wishlist', JSON.stringify(shopkeeperWishlist));
  }, [shopkeeperWishlist]);

  // Delivery check helper
  const checkDelivery = (query: string): DeliveryCheckResult => {
    return validateDeliveryLocation(query, cartTotal, false, shopSettings.deliveryRadiusKm);
  };

  // Cart actions
  const addToCart = (product: Product, variantId: string, quantity: number = 1): boolean => {
    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    if (!variant || variant.stock < quantity) {
      return false;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity;
        const newQty = Math.min(currentQty + quantity, variant.stock);
        const updated = [...prev];
        updated[existingIdx] = { ...prev[existingIdx], quantity: newQty };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            variantId: variant.id,
            variant,
            quantity,
            unitPrice: product.discountPrice,
          },
        ];
      }
    });

    return true;
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          const maxStock = item.variant.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Create Order with Atomic Stock Decrement & Delivery check
  const createOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp: string;
    customerEmail?: string;
    deliveryAddress: CustomerAddress;
    paymentMethod: PaymentMethod;
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    // Check SaaS subscription block if trial expired
    if (shopSettings.subscriptionPlan === 'TRIAL' && shopSettings.trialDaysRemaining <= 0) {
      return {
        success: false,
        error: 'SaaS Store Trial Expired. Please upgrade to Pro Monthly plan in admin to accept new orders.',
      };
    }

    // 1. Stock check
    const stockCheck = validateOrderStock(
      products,
      cart.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))
    );

    if (!stockCheck.valid && stockCheck.unavailableItem) {
      return {
        success: false,
        error: `Insufficient stock for ${stockCheck.unavailableItem.productName} (${stockCheck.unavailableItem.size}). Available: ${stockCheck.unavailableItem.availableQty}`,
      };
    }

    // 2. Delivery check
    const deliveryRes = checkDelivery(orderData.deliveryAddress.pincode || orderData.deliveryAddress.locality);

    const subtotal = cartTotal;
    const deliveryFee = deliveryRes.isWithinRadius ? 0 : 80;
    const totalAmount = subtotal + deliveryFee;

    // 3. Payment creation & verification
    const paymentRes = await paymentService.verifyPayment(
      orderData.paymentMethod,
      `order_gw_${Date.now()}`
    );

    if (!paymentRes.verified && orderData.paymentMethod !== 'COD') {
      return { success: false, error: 'Payment authorization failed: ' + paymentRes.message };
    }

    // 4. Atomic Stock Decrement
    const updatedProducts = decrementStock(
      products,
      cart.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))
    );
    setProducts(updatedProducts);

    // 5. Build Order object
    const newOrderId = `RV-${Math.floor(8422 + Math.random() * 500)}`;
    const newOrder: Order = {
      id: newOrderId,
      shopId: shopSettings.shopId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerWhatsapp: orderData.customerWhatsapp,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        variantSku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        image: item.product.images[0],
      })),
      subtotal,
      deliveryFee,
      discountAmount: 0,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: paymentRes.status,
      orderStatus: 'NEW',
      deliveryEligibility: {
        distanceKm: deliveryRes.distanceKm,
        isEligible: deliveryRes.isWithinRadius,
        label: deliveryRes.badgeText,
        expressCourier: !deliveryRes.isWithinRadius,
      },
      otpVerified: true,
      whatsappInvoiceSent: true,
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    // Prepend to orders
    setOrders((prev) => [newOrder, ...prev]);

    // Send WhatsApp notification
    const itemsSummary = newOrder.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ');
    await whatsappService.sendMessage({
      toPhone: orderData.customerWhatsapp || orderData.customerPhone,
      customerName: orderData.customerName,
      template: 'ORDER_PLACED',
      variables: {
        customerName: orderData.customerName,
        orderId: newOrder.id,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        itemsSummary,
      },
    });
    setWhatsappLogs(whatsappService.getLogs());

    // Update Customer record or add new
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.mobile.replace(/\D/g, '') === orderData.customerPhone.replace(/\D/g, ''));
      if (idx > -1) {
        const existing = prev[idx];
        const updatedCust = {
          ...existing,
          totalOrders: existing.totalOrders + 1,
          totalSpend: existing.totalSpend + totalAmount,
          lastPurchaseDate: 'Today',
        };
        const next = [...prev];
        next[idx] = updatedCust;
        return next;
      } else {
        return [
          {
            id: `cust-${Date.now()}`,
            name: orderData.customerName,
            mobile: orderData.customerPhone,
            whatsapp: orderData.customerWhatsapp,
            email: orderData.customerEmail,
            locality: orderData.deliveryAddress.locality,
            totalOrders: 1,
            totalSpend: totalAmount,
            lastPurchaseDate: 'Today',
            whatsappMarketingOptIn: true,
          },
          ...prev,
        ];
      }
    });

    clearCart();
    setLastCreatedOrder(newOrder);
    return { success: true, order: newOrder };
  };

  // Update order status with valid transition and stock restoration if cancelled
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If changing to CANCELLED or REFUNDED, restore stock!
    if (
      (newStatus === 'CANCELLED' || newStatus === 'REFUNDED') &&
      targetOrder.orderStatus !== 'CANCELLED' &&
      targetOrder.orderStatus !== 'REFUNDED'
    ) {
      setProducts((currentProducts) => restoreStock(currentProducts, targetOrder.items));
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            updatedAt: 'Just now',
          };
        }
        return o;
      })
    );

    // Send automated WhatsApp message on status change
    let template: 'ORDER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | null = null;
    if (newStatus === 'CONFIRMED') template = 'ORDER_CONFIRMED';
    if (newStatus === 'SHIPPED') template = 'ORDER_SHIPPED';
    if (newStatus === 'DELIVERED') template = 'ORDER_DELIVERED';

    if (template) {
      await whatsappService.sendMessage({
        toPhone: targetOrder.customerWhatsapp || targetOrder.customerPhone,
        customerName: targetOrder.customerName,
        template,
        variables: {
          customerName: targetOrder.customerName,
          orderId: targetOrder.id,
          totalAmount: targetOrder.totalAmount,
          riderName: 'Rakesh Kumar (Shubhai Rider #4)',
          otp: '4892',
        },
      });
      setWhatsappLogs(whatsappService.getLogs());
    }
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): string => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    // Prepend so it is at the very top of the catalogue
    setProducts((prev) => [newProduct, ...prev]);
    // Reset filters so the new product is immediately visible on the customer site
    setSelectedCategory('all');
    setSearchQuery('');
    setRecentlyAddedProductId(newId);
    return newId;
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const totalStock = updated.variants
          ? updated.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
          : updated.totalStock ?? p.totalStock;
        return {
          ...p,
          ...updated,
          totalStock,
        };
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((i) => i.productId !== id));
    setWishlist((prev) => prev.filter((wid) => wid !== id));
    setShopkeeperWishlist((prev) => prev.filter((wid) => wid !== id));
  };

  const toggleShopkeeperWishlist = (productId: string) => {
    setShopkeeperWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
  };

  const applyDiscountToProduct = (productId: string, discountPercent: number, newDiscountPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const computedDiscountPrice =
          newDiscountPrice !== undefined
            ? Math.max(0, Math.min(p.price, newDiscountPrice))
            : Math.round(p.price * (1 - Math.max(0, Math.min(99, discountPercent)) / 100));
        return {
          ...p,
          discountPrice: computedDiscountPrice,
          isStagnant: discountPercent >= 40 ? true : p.isStagnant,
        };
      })
    );
  };

  const removeDiscountFromProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          discountPrice: p.price,
        };
      })
    );
  };

  const updateProductStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedVariants = p.variants.map((v) =>
          v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
        );
        const newTotalStock = updatedVariants.reduce((s, v) => s + v.stock, 0);
        return { ...p, variants: updatedVariants, totalStock: newTotalStock };
      })
    );
  };

  const applyOldStockDiscount = (productIds: string[], discountPercent: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (!productIds.includes(p.id)) return p;
        const newDiscountPrice = Math.round(p.price * (1 - discountPercent / 100));
        return {
          ...p,
          discountPrice: newDiscountPrice,
          isStagnant: true,
        };
      })
    );
  };

  // WhatsApp Campaign
  const sendOldStockBroadcast = async (
    audienceTag: string,
    productCount: number,
    discountPercent: number
  ): Promise<boolean> => {
    const campaign = whatsappService.createOldStockCampaign({
      title: `Old Stock ${discountPercent}% Liquidation Campaign`,
      audienceTag,
      productCount,
      discountPercent,
    });

    setWhatsappCampaigns((prev) => [campaign, ...prev]);

    // Send sample notification to log
    await whatsappService.sendMessage({
      toPhone: '+91 94312 XXXXX',
      customerName: 'Shubhai VIP Buyer',
      template: 'OLD_STOCK_OFFER',
      variables: {},
    });

    setWhatsappLogs(whatsappService.getLogs());
    return true;
  };

  // Customer Login
  const loginCustomerWithOtp = (mobile: string, otp: string): boolean => {
    if (otp === '1234' || otp.length === 4) {
      const existing = customers.find((c) => c.mobile.includes(mobile.slice(-10)));
      if (existing) {
        setCurrentCustomer(existing);
      } else {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: 'Shubhai Patron',
          mobile: mobile,
          whatsapp: mobile,
          locality: 'Shubhai Chowk, Hajipur',
          totalOrders: 0,
          totalSpend: 0,
          lastPurchaseDate: 'First Visit',
          whatsappMarketingOptIn: true,
        };
        setCurrentCustomer(newCustomer);
        setCustomers((prev) => [newCustomer, ...prev]);
      }
      return true;
    }
    return false;
  };

  const logoutCustomer = () => setCurrentCustomer(null);

  // Shop settings
  const updateShopSettings = (partial: Partial<ShopSettings>) => {
    setShopSettings((prev) => ({ ...prev, ...partial }));
  };

  const upgradeSubscription = async (plan: 'PRO_MONTHLY' | 'ENTERPRISE') => {
    // Razorpay subscription upgrade simulation
    setShopSettings((prev) => ({
      ...prev,
      subscriptionPlan: plan,
      trialDaysRemaining: 30,
      trialExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        language,
        setLanguage,
        shopSettings,
        updateShopSettings,
        upgradeSubscription,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        editProduct,
        deleteProduct,
        updateProductStock,
        applyOldStockDiscount,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        wishlist,
        toggleWishlist,
        shopkeeperWishlist,
        toggleShopkeeperWishlist,
        applyDiscountToProduct,
        removeDiscountFromProduct,
        orders,
        createOrder,
        updateOrderStatus,
        currentCustomer,
        setCurrentCustomer,
        customers,
        loginCustomerWithOtp,
        logoutCustomer,
        isAdminLoggedIn,
        adminSessionExpired,
        loginAdmin,
        logoutAdmin,
        lastAdminActiveTime,
        whatsappLogs,
        whatsappCampaigns,
        sendOldStockBroadcast,
        activeProductModal,
        setActiveProductModal,
        activeEditProduct,
        setActiveEditProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddSkuModalOpen,
        setIsAddSkuModalOpen,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        lastCreatedOrder,
        setLastCreatedOrder,
        recentlyAddedProductId,
        setRecentlyAddedProductId,
        checkDelivery,
        reviews,
        addReview,
        adminSearchQuery,
        setAdminSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
