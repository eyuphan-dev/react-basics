/* ============================================
   HERO BİLEŞENİ - Ana Sayfa Hero Banner
   Kampanya bilgisi, animasyonlu başlık ve CTA
   butonlarıyla kullanıcıyı karşılar
   ============================================ */

import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

/**
 * HeroSection: Ana sayfanın en üstünde yer alan ilgi çekici banner
 * Kampanya vurgusu ve güven simgeleri ile kullanıcıyı çeker
 */
export default function HeroSection() {
  return (
    <>
      {/* Üst kampanya şeridi */}
      <div className="promo-bar">
        <div className="container">
          <span>🎉 Yeni üyelere <strong>%15 indirim!</strong> • Ücretsiz kargo fırsatını kaçırmayın 🚚</span>
        </div>
      </div>

      <section className="hero">
        <div className="container">
          {/* Sol taraf: Metin içeriği */}
          <div className="hero__content">
            <span className="hero__badge">🔥 2026 İlkbahar Koleksiyonu</span>
            <h1 className="hero__title">
              Alışverişin <span>Yeni Adresi</span>
            </h1>
            <p className="hero__description">
              Binlerce ürün arasından size en uygun olanı bulun. 
              Hızlı kargo, güvenli ödeme ve uygun fiyat garantisi ile alışverişin keyfini çıkarın.
            </p>
            {/* CTA butonları */}
            <div className="hero__actions">
              <Link to="/urunler" className="btn btn--primary">
                <FiShoppingBag /> Alışverişe Başla
              </Link>
              <Link to="/urunler?category=smartphones" className="btn btn--outline">
                Keşfet <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Sağ taraf: Hero görseli */}
          <div className="hero__image">
            <img src={`${import.meta.env.BASE_URL}img/1.jpg`} alt="ShopZone Kampanya" />
          </div>
        </div>
      </section>

      {/* Güven simgeleri şeridi */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar__grid">
            <div className="trust-bar__item">
              <FiTruck className="trust-bar__icon" />
              <div>
                <strong>Ücretsiz Kargo</strong>
                <span>500₺ üzeri siparişlerde</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <FiShield className="trust-bar__icon" />
              <div>
                <strong>Güvenli Ödeme</strong>
                <span>256-bit SSL şifreleme</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <FiRefreshCw className="trust-bar__icon" />
              <div>
                <strong>Kolay İade</strong>
                <span>14 gün içinde ücretsiz iade</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
