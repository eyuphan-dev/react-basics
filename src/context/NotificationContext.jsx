/* ============================================
   BİLDİRİM MERKEZİ CONTEXT - NotificationContext
   Uygulama genelinde bildirim yönetimi.
   Sepet, favori, sipariş gibi işlemlerde
   bildirim oluşturur ve gösterir.
   ============================================ */

import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

/**
 * NotificationProvider: Bildirim listesini yönetir
 * Bildirim tipleri: success, info, warning, order
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Hoş geldiniz! 🎉',
      message: 'ShopZone\'a hoş geldiniz. Alışverişin keyfini çıkarın!',
      time: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Kampanya Bitiyor! ⏰',
      message: '%15 indirim fırsatı yarın sona eriyor.',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ]);

  // Yeni bildirim ekle
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Bildirimi okundu olarak işaretle
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Tüm bildirimleri okundu yap
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Bildirimi sil
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotifications custom hook
 * Kullanım: const { notifications, addNotification } = useNotifications();
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications hook\'u NotificationProvider içinde kullanılmalıdır');
  }
  return context;
}
