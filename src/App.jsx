/* ============================================
   APP BİLEŞENİ - Ana Uygulama Layout'u
   Header ve Footer tüm sayfalarda ortak gösterilir.
   Outlet bileşeni, aktif route'un içeriğini render eder.
   ============================================ */

import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';

/**
 * App: Tüm sayfaları saran ana layout bileşeni
 * Header → Sayfa İçeriği (Outlet) → Footer yapısı
 * Toaster: Toast bildirimlerinin render edildiği yer
 */
export default function App() {
  return (
    <>
      {/* Toast bildirimleri - uygulama genelinde kullanılır */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#22222e',
            color: '#eaeaf0',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
          },
        }}
      />

      {/* Sabit navigasyon çubuğu */}
      <Header />

      {/* Aktif route'un içeriği burada render edilir */}
      <main>
        <Outlet />
      </main>

      {/* Sayfa alt bilgisi */}
      <Footer />
    </>
  );
}
