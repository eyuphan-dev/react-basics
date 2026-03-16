/* ============================================
   FOOTER BİLEŞENİ - Site Alt Bilgi Bölümü
   Marka bilgisi, hızlı linkler, iletişim ve
   sosyal medya ikonlarını içerir
   ============================================ */

import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer ana grid: 4 sütunlu yapı */}
        <div className="footer__grid">

          {/* Marka bilgisi sütunu */}
          <div>
            <Link to="/" className="header__logo">
              ShopZone
            </Link>
            <p className="footer__brand-desc">
              En kaliteli ürünleri uygun fiyatlarla keşfedin. 
              ShopZone ile alışveriş deneyiminizi bir üst seviyeye taşıyın.
            </p>
            {/* Sosyal medya ikonları */}
            <div className="footer__socials">
              <a href="#" className="footer__social-icon"><FiTwitter /></a>
              <a href="#" className="footer__social-icon"><FiInstagram /></a>
              <a href="#" className="footer__social-icon"><FiGithub /></a>
              <a href="#" className="footer__social-icon"><FiLinkedin /></a>
            </div>
          </div>

          {/* Hızlı linkler sütunu */}
          <div>
            <h4 className="footer__col-title">Hızlı Linkler</h4>
            <div className="footer__links">
              <Link to="/">Ana Sayfa</Link>
              <Link to="/urunler">Tüm Ürünler</Link>
              <Link to="/sepet">Sepetim</Link>
              <Link to="/favoriler">Favorilerim</Link>
            </div>
          </div>

          {/* Kategoriler sütunu */}
          <div>
            <h4 className="footer__col-title">Kategoriler</h4>
            <div className="footer__links">
              <Link to="/urunler?category=smartphones">Telefonlar</Link>
              <Link to="/urunler?category=laptops">Laptop</Link>
              <Link to="/urunler?category=fragrances">Parfüm</Link>
              <Link to="/urunler?category=groceries">Market</Link>
            </div>
          </div>

          {/* İletişim sütunu - react-icons kullanılarak tutarlılık sağlandı */}
          <div>
            <h4 className="footer__col-title">İletişim</h4>
            <div className="footer__links">
              <span className="footer__contact-item">
                <FiMail className="footer__contact-icon" />
                info@shopzone.com
              </span>
              <span className="footer__contact-item">
                <FiPhone className="footer__contact-icon" />
                +90 555 123 4567
              </span>
              <span className="footer__contact-item">
                <FiMapPin className="footer__contact-icon" />
                İstanbul, Türkiye
              </span>
            </div>
          </div>
        </div>

        {/* Footer alt çizgisi - telif hakkı */}
        <div className="footer__bottom">
          <p>© 2026 ShopZone. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
