# Rupesh Vastralaya & Shopping Mall — Retailer SaaS & E-Commerce Engine

A production-ready responsive full-stack Indian retail garment e-commerce platform and multitenant SaaS admin console designed for local Indian shopkeepers.

**Primary Flagship Store:**
- **Store Name:** Rupesh Vastralaya & Shopping Mall
- **Location:** Shubhai Chowk, Mahua Road, Hajipur, Vaishali, Bihar – 844102
- **WhatsApp & Support:** +91 6206875074
- **Verified GSTIN:** 10AAACR8421K1ZP

---

## 1. Project Overview & Architecture
This solution provides a **Flipkart-inspired customer storefront** alongside a **multitenant retailer SaaS admin portal** that features:
- **5 km Local Delivery Geo-Fence Engine:** Free 24-hr express delivery from Shubhai Chowk flagship store, automatic courier routing beyond 5 km.
- **Old Stock Liquidation & WhatsApp Automation Engine:** Automated detection of stagnant inventory (3, 6, 9, 12+ months) with bilingual WhatsApp broadcast campaign generator.
- **Live Order Workflow Pipeline:** Real-time state machine (`NEW` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`), with atomic stock reservation and cancellation restoration.
- **7-Day Free Trial & Monthly Subscription SaaS:** Razorpay Subscriptions billing architecture (`₹2,999/month`) with automated trial countdown and non-destructive service protection.
- **Multilingual Experience:** Instant switching between English, हिन्दी (Hindi), and Hinglish.

---

## 2. Environment Variables Setup
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your secrets:
```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Razorpay Payments & Monthly Subscriptions
RAZORPAY_KEY_ID="rzp_test_YourKeyId"
RAZORPAY_KEY_SECRET="YourKeySecret"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecret"

# WhatsApp Cloud API (Meta for Developers)
WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
WHATSAPP_ACCESS_TOKEN="EAAB..."
WHATSAPP_PHONE_NUMBER_ID="109876543210"
WHATSAPP_VERIFY_TOKEN="rupesh_secret_token_2026"

# Shop Defaults
VITE_SHOP_NAME="Rupesh Vastralaya & Shopping Mall"
VITE_SHOP_PHONE="6206875074"
VITE_SHOP_PINCODE="844102"
VITE_SHOP_RADIUS_KM="5.0"
```

*Note: In local development without external credentials, the platform runs in **MOCK MODE**, visibly indicated in the WhatsApp Engine.*

---

## 3. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Note your Project URL and public `anon` key from **Settings > API**.
3. Under **Database**, verify PostgreSQL 15+ is running.

---

## 4. Database Migration
Apply the complete migration script located in `/supabase/migrations/20261001_initial_schema.sql` via Supabase SQL Editor or CLI:

```bash
supabase db push
# OR paste /supabase/migrations/20261001_initial_schema.sql into the Supabase SQL Query Editor
```

This creates:
- `shops`, `shop_settings`, `shop_subscriptions`, `shop_admins`
- `customers`, `customer_addresses`
- `categories`, `subcategories`, `products`, `product_variants`, `inventory`
- `orders`, `order_items`, `payments`
- `reviews`, `wishlists`, `discounts`, `old_stock_items`
- `whatsapp_templates`, `whatsapp_campaigns`, `whatsapp_messages`, `delivery_zones`
- Full Row Level Security (RLS) policies and B-Tree indexes.

---

## 5. Storage Bucket Setup
1. In Supabase Dashboard, navigate to **Storage > New Bucket**.
2. Name the bucket `product-media` and enable **Public bucket**.
3. Create an RLS policy granting `SELECT` to public and `INSERT/UPDATE` to authenticated shop admins.

---

## 6. Authentication Setup
- **Customers:** Enable Phone OTP Authentication via Twilio / Msg9P / Fast2SMS SMS provider in Supabase Auth.
- **Shop Admins:** Email/Password authentication with role-based validation against `shop_admins` table.

---

## 7. Razorpay Setup
1. Sign up on [Razorpay](https://razorpay.com) and generate API Keys in Test Mode.
2. In **Subscriptions**, create a Plan for `₹2,999` with monthly recurring cycle.
3. Configure Webhook URL `https://your-domain.com/api/webhooks/razorpay` listening for:
   - `payment.captured`
   - `subscription.charged`
   - `subscription.cancelled`

---

## 8. WhatsApp Cloud API Provider Setup
1. Log in to [Meta for Developers](https://developers.facebook.com) and create a WhatsApp Business App.
2. Generate a System User Access Token and Phone Number ID.
3. Create and approve bilingual message templates: `order_placed`, `order_shipped`, `old_stock_liquidation`.
4. When credentials are not provided, the embedded **Mock Automation Engine** records and previews messages without external charges.

---

## 9. Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Lint and type check
npm run lint
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 10. GitHub Deployment
```bash
git init
git add .
git commit -m "feat: complete Rupesh Vastralaya e-commerce and SaaS admin engine"
git branch -M main
git remote add origin https://github.com/your-username/rupesh-vastralaya-saas.git
git push -u origin main
```

---

## 11. Vercel Deployment
1. Import repository on [Vercel](https://vercel.com).
2. Select Framework Preset: `Vite` (or `Next.js`).
3. Under Environment Variables, input all keys from `.env.example`.
4. Deploy with one click.

---

## 12. Production Checklist
- [x] RLS enabled on all sensitive database tables
- [x] Zero client-side leakage of Razorpay secrets or WhatsApp tokens
- [x] 5 km local delivery calculation verified against Shubhai Chowk coordinates
- [x] Atomic variant-level inventory subtraction on order creation
- [x] Stock restoration upon order cancellation
- [x] 7-day trial expiry blocks new order creation while preserving historical data
- [x] Responsive layout tested for mobile, tablet, and desktop viewports
- [x] Multilingual dictionary covering English, Hindi, and Hinglish
