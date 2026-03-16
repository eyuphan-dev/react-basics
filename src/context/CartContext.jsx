/* ============================================
   SEPET CONTEXT - Sepet State Yönetimi
   useReducer + Context API ile sepet işlemleri
   localStorage üzerinden kalıcılık sağlar
   ============================================ */

import { createContext, useContext, useReducer, useEffect } from 'react';

// Context oluştur
const CartContext = createContext();

// localStorage'dan sepet verisini oku (ilk yükleme için)
function getInitialCart() {
  try {
    const saved = localStorage.getItem('shopzone_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Sepet reducer fonksiyonu
 * Tüm sepet işlemlerini (ekle, çıkar, güncelle, temizle) yönetir
 * Her action bir type ve gerekli payload içerir
 */
function cartReducer(state, action) {
  switch (action.type) {
    // Sepete ürün ekle: Eğer ürün zaten varsa miktarını artır, yoksa yeni ekle
    case 'ADD_ITEM': {
      const existingIndex = state.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        const newState = [...state];
        newState[existingIndex] = {
          ...newState[existingIndex],
          quantity: newState[existingIndex].quantity + 1,
        };
        return newState;
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    // Sepetten ürün çıkar: Miktarı 1'den fazlaysa azalt, 1 ise tamamen kaldır
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);

    // Ürün miktarını güncelle (artırma/azaltma)
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) return state.filter(item => item.id !== id);
      return state.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    }

    // Sepeti tamamen temizle
    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

/**
 * CartProvider: Uygulamayı saran context sağlayıcı
 * Sepet verisi ve işlem fonksiyonlarını tüm alt bileşenlere sunar
 */
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);

  // Sepet her değiştiğinde localStorage'a kaydet (kalıcılık)
  useEffect(() => {
    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
  }, [cart]);

  // Sepete ürün ekleme fonksiyonu
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  // Sepetten ürün silme fonksiyonu
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  // Ürün miktarını güncelleme fonksiyonu
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  // Sepeti temizleme fonksiyonu
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Toplam ürün sayısını hesapla (tüm ürünlerin miktarlarının toplamı)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Toplam fiyatı hesapla (her ürünün fiyat × miktar toplamı)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart custom hook
 * Herhangi bir bileşenden sepet verilerine ve fonksiyonlara erişmek için kullanılır
 * Kullanım: const { cart, addToCart, totalPrice } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart hook\'u CartProvider içinde kullanılmalıdır');
  }
  return context;
}
