/* ============================================
   ÜRÜN DETAY SAYFASI - ProductDetailPage
   Ürün bilgileri, TL fiyat, indirim gösterimi,
   stok durumu, kullanıcı yorumları ve
   son görüntülenen ürünler kaydı
   ============================================ */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar, FiTruck, FiShield, FiSend } from 'react-icons/fi';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { fetchProductById } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, translateCategory, getStockStatus, getOriginalPrice, getRatingStars, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  // Kullanıcı tarafından yazılan yorumlar (lokal state)
  const [userReviews, setUserReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user, isAuthenticated } = useAuth();

  // Ürün detayını API'den çek ve son görüntülenenlere ekle
  useEffect(() => {
    setLoading(true);
    setError(false);
    setUserReviews([]);
    fetchProductById(id)
      .then(data => {
        setProduct(data);
        setSelectedImage(0);
        addToRecentlyViewed({
          id: data.id,
          title: data.title,
          price: data.price,
          thumbnail: data.thumbnail,
          category: data.category,
          rating: data.rating,
          discountPercentage: data.discountPercentage,
          stock: data.stock,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Ürün detayı yüklenemedi:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Sepete ekleme
  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    toast.success(product.title + ' sepete eklendi!');
  };

  // Favori toggle
  const handleToggleFavorite = () => {
    if (!product) return;
    const wasFav = isFavorite(product.id);
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
    if (wasFav) {
      toast('Favorilerden çıkarıldı', { icon: '💔' });
    } else {
      toast.success('Favorilere eklendi! ❤️');
    }
  };

  /**
   * Yorum gönderme işleyicisi
   * Kullanıcı adı auth context'ten alınır
   */
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Lütfen bir yorum yazın');
      return;
    }

    const newReview = {
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString(),
      reviewerName: isAuthenticated ? `${user.firstName} ${user.lastName}` : 'Misafir Kullanıcı',
    };

    setUserReviews(prev => [newReview, ...prev]);
    setReviewComment('');
    setReviewRating(5);
    toast.success('Yorumunuz eklendi! ⭐');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">😕</div>
          <h3 className="empty-state__title">Ürün bulunamadı</h3>
          <Link to="/urunler" className="btn btn--primary">Ürünlere Dön</Link>
        </div>
      </div>
    );
  }

  const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : 'N/A';
  const stockStatus = getStockStatus(product.stock || 0);
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const favored = isFavorite(product.id);
  const stars = getRatingStars(product.rating || 0);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  // API yorumları + kullanıcı yorumlarını birleştir
  const allReviews = [...userReviews, ...(product.reviews || [])];

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/urunler">Ürünler</Link>
          <span>/</span>
          <Link to={`/urunler?category=${product.category}`}>
            {translateCategory(product.category)}
          </Link>
          <span>/</span>
          <span className="breadcrumb__current">{product.title}</span>
        </div>

        <div className="product-detail__grid">
          <div className="product-detail__gallery">
            <div className="product-detail__image-box">
              {product.discountPercentage > 0 && (
                <span className="product-detail__discount-badge">
                  %{Math.round(product.discountPercentage)} İndirim
                </span>
              )}
              <img src={images[selectedImage]} alt={product.title} />
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`product-detail__thumb ${idx === selectedImage ? 'product-detail__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${product.title} - ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <span className="product-detail__category">
              {translateCategory(product.category)}
            </span>
            <h1 className="product-detail__title">{product.title}</h1>

            <div className="product-detail__rating">
              <div className="product-detail__stars">
                {Array(stars.full).fill(null).map((_, i) => (
                  <FaStar key={`f${i}`} className="product-detail__rating-star" />
                ))}
                {stars.half > 0 && <FaStarHalfAlt className="product-detail__rating-star" />}
                {Array(stars.empty).fill(null).map((_, i) => (
                  <FaRegStar key={`e${i}`} className="product-detail__rating-star" />
                ))}
              </div>
              <span>{ratingValue}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                ({allReviews.length} değerlendirme)
              </span>
            </div>

            <div className="product-detail__price-section">
              <span className="product-detail__price">{formatPrice(product.price)}</span>
              {originalPrice && (
                <>
                  <span className="product-detail__old-price">{formatPrice(originalPrice)}</span>
                  <span className="product-detail__discount-tag">%{Math.round(product.discountPercentage)} indirim</span>
                </>
              )}
            </div>

            <div className="product-detail__stock" style={{ color: stockStatus.color }}>
              <span className="product-detail__stock-dot" style={{ background: stockStatus.color }}></span>
              {stockStatus.text}
            </div>

            <p className="product-detail__description">{product.description}</p>

            <div className="product-detail__meta">
              {product.brand && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">Marka</span>
                  <span>{product.brand}</span>
                </div>
              )}
              {product.warrantyInformation && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">Garanti</span>
                  <span>{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">Kargo</span>
                  <span>{product.shippingInformation}</span>
                </div>
              )}
              {product.returnPolicy && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">İade</span>
                  <span>{product.returnPolicy}</span>
                </div>
              )}
            </div>

            <div className="product-detail__actions">
              <button className="btn btn--primary" onClick={handleAddToCart} disabled={!stockStatus.inStock}>
                <FiShoppingCart /> {stockStatus.inStock ? 'Sepete Ekle' : 'Tükendi'}
              </button>
              <button className="btn btn--outline" onClick={handleToggleFavorite}>
                {favored ? <FaHeart style={{ color: 'var(--color-danger)' }} /> : <FiHeart />}
                {favored ? ' Favorilerde' : ' Favorilere Ekle'}
              </button>
            </div>

            <div className="product-detail__guarantees">
              <div className="product-detail__guarantee">
                <FiTruck /> Hızlı & Güvenli Kargo
              </div>
              <div className="product-detail__guarantee">
                <FiShield /> Orijinal Ürün Garantisi
              </div>
            </div>
          </div>
        </div>

        {/* Yorumlar ve Yorum Yazma Bölümü */}
        <section className="reviews-section">
          <h2 className="reviews-section__title">
            Müşteri Yorumları ({allReviews.length})
          </h2>

          {/* Yorum yazma formu */}
          <div className="review-form">
            <h3 className="review-form__title">Yorum Yaz</h3>
            <form onSubmit={handleSubmitReview}>
              {/* Yıldız puanlama seçici */}
              <div className="review-form__rating">
                <span>Puanınız:</span>
                <div className="review-form__stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="review-form__star-btn"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <FaStar
                        style={{
                          color: star <= (hoverRating || reviewRating)
                            ? 'var(--color-warning)'
                            : 'var(--color-text-muted)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Yorum metni */}
              <textarea
                className="review-form__textarea"
                placeholder="Bu ürün hakkındaki düşüncelerinizi yazın..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
              <button type="submit" className="btn btn--primary btn--sm">
                <FiSend /> Yorumu Gönder
              </button>
            </form>
          </div>

          {/* Yorum kartları listesi */}
          {allReviews.length > 0 && (
            <div className="reviews-grid">
              {allReviews.map((review, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-card__header">
                    <div className="review-card__avatar">
                      {review.reviewerName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <strong className="review-card__name">{review.reviewerName}</strong>
                      <span className="review-card__date">{formatDate(review.date)}</span>
                    </div>
                    <div className="review-card__rating">
                      {Array(review.rating).fill(null).map((_, i) => (
                        <FaStar key={i} style={{ color: 'var(--color-warning)', fontSize: '0.85rem' }} />
                      ))}
                    </div>
                  </div>
                  <p className="review-card__comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
