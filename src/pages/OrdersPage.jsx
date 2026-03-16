/* ============================================
   SİPARİŞLERİM SAYFASI - OrdersPage
   Kullanıcının tüm siparişlerini listeler.
   Her sipariş için animasyonlu ilerleme çubuğu
   ve kargo takip durumu gösterir.
   ============================================ */

import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { useOrders, ORDER_STATUSES } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatTRY, formatDate } from '../utils/helpers';

export default function OrdersPage() {
  const { orders } = useOrders();
  const { isAuthenticated } = useAuth();

  // Giriş yapmamış kullanıcı
  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">🔐</div>
            <h3 className="empty-state__title">Giriş Yapmalısınız</h3>
            <p className="empty-state__text">
              Siparişlerinizi görüntülemek için giriş yapın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sipariş yok
  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Ana Sayfa</Link>
            <span>/</span>
            <span className="breadcrumb__current">Siparişlerim</span>
          </div>
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h3 className="empty-state__title">Henüz siparişiniz yok</h3>
            <p className="empty-state__text">
              İlk siparişinizi vermek için alışverişe başlayın!
            </p>
            <Link to="/urunler" className="btn btn--primary">
              <FiShoppingBag /> Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          <span>/</span>
          <span className="breadcrumb__current">Siparişlerim</span>
        </div>

        <h1 className="orders-page__title">
          <FiPackage /> Siparişlerim ({orders.length})
        </h1>

        {/* Sipariş kartları listesi */}
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              {/* Sipariş üst bilgileri */}
              <div className="order-card__header">
                <div>
                  <span className="order-card__number">#{order.orderNumber}</span>
                  <span className="order-card__date">{formatDate(order.date)}</span>
                </div>
                <span className="order-card__total">{formatTRY(order.total)}</span>
              </div>

              {/* İlerleme çubuğu - animasyonlu sipariş takibi */}
              <div className="order-progress">
                {ORDER_STATUSES.map((status, idx) => (
                  <div
                    key={status.key}
                    className={`order-progress__step ${idx <= order.statusIndex ? 'order-progress__step--completed' : ''} ${idx === order.statusIndex ? 'order-progress__step--current' : ''}`}
                  >
                    <div className="order-progress__icon">{status.icon}</div>
                    <span className="order-progress__label">{status.label}</span>
                  </div>
                ))}
                {/* İlerleme çizgisi */}
                <div className="order-progress__bar">
                  <div
                    className="order-progress__bar-fill"
                    style={{ width: `${(order.statusIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Siparişteki ürünler */}
              <div className="order-card__items">
                {order.items.map(item => (
                  <div key={item.id} className="order-card__item">
                    <img src={item.thumbnail} alt={item.title} />
                    <div>
                      <span className="order-card__item-name">{item.title}</span>
                      <span className="order-card__item-qty">{item.quantity} adet</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kupon indirimi varsa */}
              {order.couponDiscount > 0 && (
                <div className="order-card__discount">
                  🏷️ Kupon indirimi uygulandı: -{formatTRY(order.couponDiscount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
