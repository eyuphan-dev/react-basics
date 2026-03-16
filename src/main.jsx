/* ============================================
   UYGULAMA GİRİŞ NOKTASI - main.jsx
   React uygulamasının başlatıldığı dosya.
   Router, Context Provider'lar ve Route tanımları burada.
   ============================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Global stiller
import './index.css';

// Ana layout bileşeni
import App from './App';

// Context Provider'lar (state yönetimi)
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';

// Sayfa bileşenleri
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import OrdersPage from './pages/OrdersPage';

// Admin Bileşenleri
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';

/**
 * Uygulama ağacı yapısı:
 * Tüm yeni provider'lar en dışta kapsayıcı olarak eklenmiştir
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <FavoritesProvider>
                <RecentlyViewedProvider>
                  <OrderProvider>
                    <Routes>
                      {/* App bileşeni layout olarak kullanılır (Main Site) */}
                      <Route path="/" element={<App />}>
                        <Route index element={<HomePage />} />
                        <Route path="urunler" element={<ProductsPage />} />
                        <Route path="urun/:id" element={<ProductDetailPage />} />
                        <Route path="sepet" element={<CartPage />} />
                        <Route path="favoriler" element={<FavoritesPage />} />
                        <Route path="siparislerim" element={<OrdersPage />} />
                      </Route>
                      
                      {/* Admin Paneli Layout'u (Ayrı Layout) */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="products" element={<ProductsAdminPage />} />
                      </Route>
                    </Routes>
                  </OrderProvider>
                </RecentlyViewedProvider>
              </FavoritesProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
