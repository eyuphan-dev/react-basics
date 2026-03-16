/* ============================================
   ANA SAYFA - HomePage
   Hero, güven şeridi, kategoriler, öne çıkan
   ürünler ve son görüntülenen ürünler bölümleri
   ============================================ */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import { fetchAllProducts } from '../api/productApi';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useRecentlyViewed();

  // İlk 8 ürünü "Öne Çıkan Ürünler" olarak yükle
  useEffect(() => {
    fetchAllProducts(8)
      .then(products => {
        setFeaturedProducts(products);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ürünler yüklenemedi:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero banner, kampanya şeridi ve güven simgeleri */}
      <HeroSection />

      {/* Kategoriler bölümü */}
      <CategorySection />

      {/* Öne çıkan ürünler bölümü */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Öne Çıkan Ürünler</h2>
            <p className="section__subtitle">
              En popüler ve en çok satan ürünlerimizi keşfedin
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Tüm ürünlere yönlendirme butonu */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/urunler" className="btn btn--outline">
              Tüm Ürünleri Görüntüle <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Son görüntülenen ürünler bölümü - en az 1 ürün varsa göster */}
      {recentlyViewed.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section__header">
              <h2 className="section__title">Son Görüntülediğiniz Ürünler</h2>
              <p className="section__subtitle">
                Daha önce incelediğiniz ürünlere hızlıca göz atın
              </p>
            </div>
            <div className="products-grid">
              {recentlyViewed.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
