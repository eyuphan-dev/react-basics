/* ============================================
   SON GÖRÜNTÜLENEN ÜRÜNLER CONTEXT
   Kullanıcının son baktığı ürünleri takip eder.
   Ürün detay sayfasına her girişte kaydedilir.
   localStorage ile kalıcılık sağlar.
   ============================================ */

import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

// localStorage'dan son görüntülenen ürünleri oku
function getInitialRecentlyViewed() {
  try {
    const saved = localStorage.getItem('shopzone_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * RecentlyViewedProvider: Son görüntülenen ürünleri yönetir
 * En fazla 8 ürün saklar, en son görüntülenen en başta
 */
export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState(getInitialRecentlyViewed);

  // Değişiklikleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('shopzone_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  /**
   * Ürünü son görüntülenenlere ekle
   * Zaten listede varsa en başa taşı (tekrarı engelle)
   * Maksimum 8 ürün sakla
   */
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

/**
 * useRecentlyViewed custom hook
 * Kullanım: const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
 */
export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed hook\'u RecentlyViewedProvider içinde kullanılmalıdır');
  }
  return context;
}
