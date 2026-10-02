-- ============================================================================
-- RUPESH VASTRALAYA & SHOPPING MALL (RETAILER SAAS) - POSTGRESQL SCHEMA
-- Migration: 20261001_initial_schema.sql
-- Target Database: Supabase PostgreSQL (Postgres 15+)
-- Features: Multitenancy (shop_id), UUID PKs, Atomic Stock, Geo-Fencing, WhatsApp Engine, RLS
-- ============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SHOPS & TENANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    location TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    gstin VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    center_lat DOUBLE PRECISION NOT NULL DEFAULT 25.6859,
    center_lng DOUBLE PRECISION NOT NULL DEFAULT 85.2155,
    delivery_radius_km DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    free_delivery_min_order NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
    instant_delivery_otp_required BOOLEAN DEFAULT TRUE,
    delivery_24hr_promise BOOLEAN DEFAULT TRUE,
    currency_code VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_shop_settings_shop UNIQUE (shop_id)
);

CREATE TABLE IF NOT EXISTS public.shop_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL DEFAULT 'TRIAL',
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'TRIAL', -- TRIAL, ACTIVE, EXPIRED, PAYMENT_FAILED, SUSPENDED
    trial_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trial_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    next_billing_date TIMESTAMPTZ,
    monthly_price NUMERIC(10, 2) DEFAULT 2999.00,
    payment_provider VARCHAR(50) DEFAULT 'RAZORPAY',
    external_subscription_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_shop_subscription UNIQUE (shop_id)
);

CREATE TABLE IF NOT EXISTS public.shop_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    auth_user_id UUID, -- maps to auth.users.id
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN', -- OWNER, ADMIN, MANAGER, DISPATCHER
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_shop_admin_email UNIQUE (shop_id, email)
);

-- ============================================================================
-- 2. CUSTOMERS & ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    auth_user_id UUID,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    total_orders INTEGER DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0.00,
    last_purchase_date TIMESTAMPTZ,
    whatsapp_marketing_opt_in BOOLEAN DEFAULT TRUE,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_customer_mobile_shop UNIQUE (shop_id, mobile)
);

CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    address_line TEXT NOT NULL,
    locality VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Hajipur',
    state VARCHAR(100) NOT NULL DEFAULT 'Bihar',
    distance_km DOUBLE PRECISION,
    is_within_5km BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. PRODUCT CATALOGUE & INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    subcategory VARCHAR(100),
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2) NOT NULL,
    fabric VARCHAR(100),
    brand VARCHAR(100),
    sku VARCHAR(100) NOT NULL,
    total_stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    is_stagnant BOOLEAN DEFAULT FALSE,
    stagnant_months INTEGER DEFAULT 0,
    stagnant_age_days INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_product_sku_shop UNIQUE (shop_id, sku)
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    price_modifier NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_variant_sku UNIQUE (sku)
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    low_stock_threshold INTEGER DEFAULT 3,
    last_sold_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_inventory_variant UNIQUE (variant_id)
);

-- ============================================================================
-- 4. ORDERS, ITEMS & PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. RV-8421
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_whatsapp VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- COD, UPI, RAZORPAY, PHONEPE
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    order_status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
    delivery_distance_km DOUBLE PRECISION,
    is_5km_eligible BOOLEAN DEFAULT TRUE,
    otp_verified BOOLEAN DEFAULT TRUE,
    whatsapp_invoice_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_sku VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_provider VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(255),
    payment_id VARCHAR(255),
    signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. REVIEWS, WISHLISTS & OLD STOCK AUTOMATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_customer_wishlist UNIQUE (customer_id)
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_wishlist_product UNIQUE (wishlist_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    discount_percent NUMERIC(5, 2) NOT NULL,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.old_stock_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    days_unsold INTEGER NOT NULL,
    clearance_discount_percent NUMERIC(5, 2) DEFAULT 60.00,
    marked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. WHATSAPP TEMPLATES, CAMPAIGNS & LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    template_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- ORDER_STATUS, MARKETING, REVIEW
    body_content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'hi',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    audience_tag VARCHAR(100) NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    preview_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),
    template_name VARCHAR(100),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'SENT', -- SENT, DELIVERED, READ, FAILED
    direction VARCHAR(20) DEFAULT 'OUTBOUND',
    is_mock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    channel VARCHAR(50) DEFAULT 'WHATSAPP',
    target_identifier VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    zone_name VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    approx_distance_km DOUBLE PRECISION NOT NULL,
    is_eligible_5km BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_shop_cat ON public.products(shop_id, category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_status ON public.orders(shop_id, order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_shop_mobile ON public.customers(shop_id, mobile);
CREATE INDEX IF NOT EXISTS idx_whatsapp_shop ON public.whatsapp_messages(shop_id, created_at DESC);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Public can view active shops
CREATE POLICY "Public shops are viewable by everyone" 
ON public.shops FOR SELECT USING (is_active = true);

-- Public can view active products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (is_public = true);

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() IS NOT NULL AND customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid()));

-- Shop Admins have full access to their shop data
CREATE POLICY "Shop Admins have full access to their shop orders" 
ON public.orders FOR ALL 
USING (shop_id IN (SELECT shop_id FROM public.shop_admins WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 9. DEFAULT SEED RECORD: Rupesh Vastralaya & Shopping Mall
-- ============================================================================
INSERT INTO public.shops (id, slug, name, tagline, location, pincode, phone, whatsapp, gstin)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'rupesh-vastralaya-hajipur',
    'Rupesh Vastralaya & Shopping Mall',
    'Leading Family Garment & Saree Showroom in Vaishali District',
    'Shubhai Chowk, Mahua Road, Hajipur, Vaishali, Bihar – 844102',
    '844102',
    '6206875074',
    '6206875074',
    '10AAACR8421K1ZP'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.shop_settings (shop_id, center_lat, center_lng, delivery_radius_km, free_delivery_min_order)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    25.6859,
    85.2155,
    5.0,
    999.00
) ON CONFLICT (shop_id) DO NOTHING;

INSERT INTO public.shop_subscriptions (shop_id, plan_name, subscription_status, trial_start, trial_end, monthly_price)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'TRIAL',
    'TRIAL',
    NOW(),
    NOW() + INTERVAL '4 days',
    2999.00
) ON CONFLICT (shop_id) DO NOTHING;
