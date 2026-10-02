/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { StorefrontView } from './components/storefront/StorefrontView';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { CustomerAuthModal } from './components/storefront/CustomerAuthModal';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminLiveOrders } from './components/admin/AdminLiveOrders';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminWishlistDiscounts } from './components/admin/AdminWishlistDiscounts';
import { AdminWhatsApp } from './components/admin/AdminWhatsApp';
import { AdminDelivery } from './components/admin/AdminDelivery';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminSettings } from './components/admin/AdminSettings';
import { AddProductModal } from './components/admin/AddProductModal';
import { SubscriptionUpgradeModal } from './components/admin/SubscriptionUpgradeModal';
import { SuperAdminView } from './components/admin/SuperAdminView';
import { AdminLoginView } from './components/admin/AdminLoginView';

const AppContent: React.FC = () => {
  const { currentView, adminTab, isAdminLoggedIn, adminSessionExpired } = useStore();

  if (currentView === 'super-admin') {
    return <SuperAdminView />;
  }

  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLoginView inactivityNotice={adminSessionExpired} />;
    }

    return (
      <AdminLayout>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'orders' && <AdminLiveOrders />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'wishlist' && <AdminWishlistDiscounts />}
        {adminTab === 'whatsapp' && <AdminWhatsApp />}
        {adminTab === 'delivery' && <AdminDelivery />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'settings' && <AdminSettings />}

        {/* Admin Modals */}
        <AddProductModal />
        <SubscriptionUpgradeModal />
      </AdminLayout>
    );
  }

  // Customer Storefront View
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white">
      <Header />
      <div className="flex-1">
        <StorefrontView />
      </div>
      <Footer />

      {/* Global Modals for Storefront */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <CustomerAuthModal />
      <OrderSuccessModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
