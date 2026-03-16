/* ============================================
   ÜRÜN KARTI BİLEŞENİ - ProductCard
   Her ürünü kart formatında gösterir.
   İndirim rozeti, stok durumu, Türkçe içerik
   ve TL para birimi desteği içerir.
   ============================================ */

import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice, translateCategory, getOriginalPrice, getStockStatus } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * ProductCard bileşeni
 * product prop'u: { id, title, price, thumbnail, category, rating, discountPercentage, stock, ... }
 * İndirim rozeti, stok durumu göstergesi ve TL fiyat gösterimi içerir
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // İndirim varsa orijinal fiyatı hesapla (üzeri çizili gösterimek için)
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const stockStatus = product.stock !== undefined ? getStockStatus(product.stock) : null;

  // Sepete ekleme işleyicisi - toast bildirimi gösterir
  const handleAddToCart = (e) => {
    e.preventDefault(); // Link navigasyonunu engelle
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    toast.success(`${product.title} sepete eklendi!`);
  };

  // Favori toggle işleyicisi
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      category: product.category,
      rating: product.rating,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
    });
    if (isFavorite(product.id)) {
      toast('Favorilerden çıkarıldı', { icon: '💔' });
    } else {
      toast.success('Favorilere eklendi! ❤️');
    }
  };

  return (
    <Link to={`/urun/${product.id}`} className="product-card">
      {/* Ürün görseli bölümü */}
      <div className="product-card__image-wrapper">
        <img src={product.thumbnail} alt={product.title} />

        {/* İndirim rozeti - sol üst köşede */}
        {product.discountPercentage > 0 && (
          <span className="product-card__discount-badge">
            %{Math.round(product.discountPercentage)} İndirim
          </span>
        )}

        {/* Favori butonu - sağ üst köşede */}
        <button
          className={`product-card__fav-btn ${isFavorite(product.id) ? 'product-card__fav-btn--active' : ''}`}
          onClick={handleToggleFavorite}
          title={isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          {isFavorite(product.id) ? <FaHeart /> : <FiHeart />}
        </button>
      </div>

      {/* Kart içerik bölümü */}
      <div className="product-card__body">
        {/* Türkçe kategori etiketi */}
        <span className="product-card__category">
          {translateCategory(product.category)}
        </span>
        {/* Ürün başlığı (max 2 satır) */}
        <h3 className="product-card__title">{product.title}</h3>

        {/* Yıldız rating gösterimi */}
        {product.rating && (
          <div className="product-card__rating">
            <FiStar className="product-card__rating-star" />
            <span>{typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}</span>
          </div>
        )}

        {/* Stok durumu göstergesi */}
        {stockStatus && (
          <span className="product-card__stock" style={{ color: stockStatus.color }}>
            {stockStatus.text}
          </span>
        )}

        {/* Fiyat bölümü: TL fiyat + varsa eski fiyat üzeri çizili */}
        <div className="product-card__footer">
          <div className="product-card__price-group">
            <span className="product-card__price">
              {formatPrice(product.price)}
            </span>
            {originalPrice && (
              <span className="product-card__old-price">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <button className="product-card__add-btn" onClick={handleAddToCart}>
            <FiShoppingBag /> Ekle
          </button>
        </div>
      </div>
    </Link>
  );
}
