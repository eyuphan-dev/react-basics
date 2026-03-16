/* ============================================
   SEPET SAYFASI - CartPage (Kupon Destekli)
   TL fiyatlarla sepet özeti, kupon kodu sistemi,
   kargo hesaplama ve sipariş oluşturma
   ============================================ */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTrash2, FiTruck, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import CartItem from '../components/CartItem';
import { formatTRY, toTRY } from '../utils/helpers';
import toast from 'react-hot-toast';

// Geçerli kupon kodları ve indirim oranları
const VALID_COUPONS = {
  'HOSGELDIN': { discount: 15, type: 'percent', label: '%15 İndirim' },
  'SHOPZONE10': { discount: 10, type: 'percent', label: '%10 İndirim' },
  'KARGO50': { discount: 50, type: 'fixed', label: '50₺ İndirim' },
  'INDIRIM100': { discount: 100, type: 'fixed', label: '100₺ İndirim' },
};

export default function CartPage() {
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // TL hesaplamaları
  const totalTRY = toTRY(totalPrice);
  const shippingCost = totalTRY > 500 ? 0 : 49.90;

  // Kupon indirimi hesapla
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = totalTRY * (appliedCoupon.discount / 100);
    } else {
      couponDiscount = appliedCoupon.discount;
    }
  }

  const grandTotal = totalTRY - couponDiscount + shippingCost;

  /**
   * Kupon kodu doğrulama ve uygulama
   * Büyük/küçük harf duyarsız kontrol
   */
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Kupon kodu girin');
      return;
    }

    const coupon = VALID_COUPONS[code];
    if (coupon) {
      setAppliedCoupon({ ...coupon, code });
      toast.success(`🏷️ "${code}" kuponu uygulandı! ${coupon.label}`);
    } else {
      setCouponError('Geçersiz kupon kodu');
      toast.error('Geçersiz kupon kodu');
    }
  };

  // Kuponu kaldır
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Kupon kaldırıldı', { icon: '🏷️' });
  };

  // Sepeti temizle
  const handleClearCart = () => {
    clearCart();
    setAppliedCoupon(null);
    toast.success('Sepet temizlendi!');
  };

  /**
   * Siparişi tamamla - OrderContext'e sipariş oluştur,
   * bildirim gönder ve sepeti temizle
   */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Sipariş vermek için giriş yapmalısınız!');
      return;
    }

    const order = createOrder(cart, grandTotal, couponDiscount);
    addNotification({
      type: 'order',
      title: 'Sipariş Oluşturuldu! 🎉',
      message: `${order.orderNumber} numaralı siparişiniz alındı. Toplam: ${formatTRY(grandTotal)}`,
    });
    clearCart();
    setAppliedCoupon(null);
    toast.success('Siparişiniz başarıyla oluşturuldu!');
    navigate('/siparislerim');
  };

  // Sepet boşsa
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">🛒</div>
            <h3 className="empty-state__title">Sepetiniz boş</h3>
            <p className="empty-state__text">
              Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!
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
    <div className="cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          <span>/</span>
          <span className="breadcrumb__current">Sepetim</span>
        </div>

        <h1 className="cart-page__title">Sepetim ({totalItems} ürün)</h1>

        <div className="cart-page__grid">
          {/* Sol sütun: Ürün kartları */}
          <div className="cart-items">
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Sağ sütun: Sipariş özeti */}
          <div className="cart-summary">
            <h3 className="cart-summary__title">Sipariş Özeti</h3>

            <div className="cart-summary__row">
              <span>Ara Toplam ({totalItems} ürün)</span>
              <span>{formatTRY(totalTRY)}</span>
            </div>

            <div className="cart-summary__row">
              <span>Kargo Ücreti</span>
              <span style={{ color: shippingCost === 0 ? 'var(--color-success)' : 'inherit' }}>
                {shippingCost === 0 ? 'Ücretsiz 🎉' : formatTRY(shippingCost)}
              </span>
            </div>

            {shippingCost > 0 && (
              <div className="cart-summary__shipping-info">
                <FiTruck />
                <span>Ücretsiz kargo için {formatTRY(500 - totalTRY)} daha ekleyin!</span>
              </div>
            )}

            {/* Kupon kodu bölümü */}
            <div className="coupon-section">
              <label className="coupon-section__label">
                <FiTag /> Kupon Kodu
              </label>
              {appliedCoupon ? (
                <div className="coupon-section__applied">
                  <span className="coupon-section__tag">
                    🏷️ {appliedCoupon.code} — {appliedCoupon.label}
                  </span>
                  <button className="coupon-section__remove" onClick={removeCoupon}>Kaldır</button>
                </div>
              ) : (
                <div className="coupon-section__input-group">
                  <input
                    type="text"
                    placeholder="Kupon kodunu girin"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button className="btn btn--sm btn--primary" onClick={handleApplyCoupon}>Uygula</button>
                </div>
              )}
              {couponError && <span className="coupon-section__error">{couponError}</span>}
            </div>

            {/* Kupon indirimi satırı */}
            {appliedCoupon && (
              <div className="cart-summary__row cart-summary__row--discount">
                <span>Kupon İndirimi</span>
                <span>-{formatTRY(couponDiscount)}</span>
              </div>
            )}

            <div className="cart-summary__row cart-summary__row--total">
              <span>Genel Toplam</span>
              <span>{formatTRY(grandTotal)}</span>
            </div>

            <div className="cart-summary__actions">
              <button className="btn btn--primary btn--full" onClick={handleCheckout}>
                Siparişi Tamamla
              </button>
              <button className="btn btn--outline btn--full" onClick={handleClearCart}>
                <FiTrash2 /> Sepeti Temizle
              </button>
            </div>

            {/* Geçerli kupon ipuçları */}
            <div className="coupon-hints">
              <p className="coupon-hints__title">Geçerli Kuponlar:</p>
              <span className="coupon-hint">HOSGELDIN</span>
              <span className="coupon-hint">SHOPZONE10</span>
              <span className="coupon-hint">KARGO50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
