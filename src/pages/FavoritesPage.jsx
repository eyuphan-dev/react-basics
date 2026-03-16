/* ============================================
   FAVORİLER SAYFASI - FavoritesPage
   Favori ürünleri listeler, breadcrumb navigasyon
   ve Türkçe arayüz içerir
   ============================================ */

import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">💜</div>
            <h3 className="empty-state__title">Favorileriniz boş</h3>
            <p className="empty-state__text">
              Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilere ekleyin.
            </p>
            <Link to="/urunler" className="btn btn--primary">
              <FiHeart /> Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        {/* Breadcrumb navigasyon */}
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          <span>/</span>
          <span className="breadcrumb__current">Favorilerim</span>
        </div>

        <h1 className="favorites-page__title">
          Favorilerim ({favorites.length} ürün)
        </h1>

        <div className="products-grid">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
