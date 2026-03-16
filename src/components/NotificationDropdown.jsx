/* ============================================
   BİLDİRİM DROPDOWN BİLEŞENİ - NotificationDropdown
   Header'daki bildirim ikonuna tıklandığında açılır.
   Bildirim listesi, okundu işaretleme ve silme içerir.
   ============================================ */

import { FiX, FiBell, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/helpers';

// Bildirim tipine göre renk eşlemesi
const typeColors = {
  success: 'var(--color-success)',
  info: 'var(--color-primary)',
  warning: 'var(--color-warning)',
  order: 'var(--color-accent)',
};

/**
 * NotificationDropdown: Bildirim paneli
 * isOpen: görünürlük durumu
 * onClose: panel kapatma callback'i
 */
export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      {/* Dropdown üst çubuğu */}
      <div className="notification-dropdown__header">
        <h3>
          <FiBell /> Bildirimler
          {unreadCount > 0 && <span className="notification-dropdown__count">({unreadCount})</span>}
        </h3>
        {unreadCount > 0 && (
          <button className="notification-dropdown__mark-all" onClick={markAllAsRead}>
            <FiCheck /> Tümünü Oku
          </button>
        )}
      </div>

      {/* Bildirim listesi */}
      <div className="notification-dropdown__list">
        {notifications.length === 0 ? (
          <div className="notification-dropdown__empty">
            Bildiriminiz yok
          </div>
        ) : (
          notifications.slice(0, 10).map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'notification-item--unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              {/* Sol renk çizgisi - bildirim tipine göre */}
              <div
                className="notification-item__indicator"
                style={{ backgroundColor: typeColors[notification.type] || typeColors.info }}
              />
              <div className="notification-item__content">
                <strong className="notification-item__title">{notification.title}</strong>
                <p className="notification-item__message">{notification.message}</p>
                <span className="notification-item__time">
                  {formatDate(notification.time)}
                </span>
              </div>
              <button
                className="notification-item__close"
                onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
              >
                <FiX />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
