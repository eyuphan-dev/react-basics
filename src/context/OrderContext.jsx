/* ============================================
   SİPARİŞ CONTEXT - OrderContext
   Sipariş oluşturma ve takip yönetimi.
   Sepetteki ürünleri siparişe dönüştürür.
   localStorage ile kalıcılık sağlar.
   ============================================ */

import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

function getInitialOrders() {
  try {
    const saved = localStorage.getItem('shopzone_orders');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Sipariş durumu aşamaları
export const ORDER_STATUSES = [
  { key: 'confirmed', label: 'Sipariş Onaylandı', icon: '✅' },
  { key: 'preparing', label: 'Hazırlanıyor', icon: '📦' },
  { key: 'shipped', label: 'Kargoya Verildi', icon: '🚚' },
  { key: 'delivered', label: 'Teslim Edildi', icon: '🎉' },
];

/**
 * OrderProvider: Sipariş yönetimi
 * createOrder: sepetteki ürünlerden sipariş oluşturur
 * Her sipariş rastgele bir durumda başlar (demo amaçlı)
 */
export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(getInitialOrders);

  useEffect(() => {
    localStorage.setItem('shopzone_orders', JSON.stringify(orders));
  }, [orders]);

  /**
   * Yeni sipariş oluştur
   * items: sepet öğeleri, total: toplam TL tutarı
   * Rastgele bir sipariş numarası ve durumu atanır
   */
  const createOrder = (items, total, couponDiscount = 0) => {
    const orderNumber = 'SZ-' + Date.now().toString(36).toUpperCase();
    // Demo: rastgele sipariş aşaması (1-3 arası, 0-indexed)
    const statusIndex = Math.floor(Math.random() * 3);

    const newOrder = {
      id: Date.now(),
      orderNumber,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),
      total,
      couponDiscount,
      statusIndex,
      date: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders hook\'u OrderProvider içinde kullanılmalıdır');
  }
  return context;
}
