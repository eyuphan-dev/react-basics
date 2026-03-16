/* ============================================
   FAVORİLER CONTEXT - Favori Ürünler Yönetimi
   Context API ile favori ekleme/çıkarma toggle
   localStorage üzerinden kalıcılık sağlar
   ============================================ */

import { createContext, useContext, useState, useEffect } from 'react';

// Context oluştur
const FavoritesContext = createContext();

// localStorage'dan favori verisini oku (ilk yükleme için)
function getInitialFavorites() {
  try {
    const saved = localStorage.getItem('shopzone_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * FavoritesProvider: Favori işlemlerini tüm alt bileşenlere sunar
 * Toggle mantığıyla çalışır: tıkla → ekle, tekrar tıkla → çıkar
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(getInitialFavorites);

  // Favoriler değiştikçe localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('shopzone_favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Favori toggle: Ürün zaten favorilerdeyse çıkar, değilse ekle
   * Bu yaklaşım tek butonla hem ekleme hem çıkarma yapar
   */
  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Bir ürünün favori olup olmadığını kontrol et
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Belirli bir ürünü favorilerden çıkar
  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * useFavorites custom hook
 * Herhangi bir bileşenden favori verilerine erişmek için kullanılır
 * Kullanım: const { favorites, toggleFavorite, isFavorite } = useFavorites();
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites hook\'u FavoritesProvider içinde kullanılmalıdır');
  }
  return context;
}
