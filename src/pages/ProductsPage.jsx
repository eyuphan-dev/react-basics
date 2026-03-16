/* ============================================
   ÜRÜNLER SAYFASI - ProductsPage
   Tüm ürün listeleme, Türkçe kategori filtreleme,
   fiyat sıralama ve arama. Ürün sayısı gösterimi.
   ============================================ */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { translateCategory } from '../utils/helpers';
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchCategories,
  searchProducts,
} from '../api/productApi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  // URL query parametrelerinden kategori ve arama değerlerini al
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // Sayfa yüklendiğinde kategori listesini çek
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(err => console.error('Kategoriler yüklenemedi:', err));
  }, []);

  /**
   * Kategori veya arama değiştiğinde ürünleri yeniden yükle
   * 3 durum: arama > kategori filtresi > tüm ürünler
   */
  useEffect(() => {
    setLoading(true);

    if (searchQuery) {
      // API'nin İngilizce araması Türkçe kısımları (örn: "kı") bulamadığı için
      // arama durumunda tüm ürünleri çekip yerel olarak filtreliyoruz
      fetchAllProducts(150)
        .then(data => {
          const term = searchQuery.toLowerCase().trim();
          const filtered = data.filter(product => 
            product.title.toLowerCase().includes(term)
          );
          setProducts(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ürünler yüklenemedi:', err);
          setLoading(false);
        });
    } else if (activeCategory) {
      fetchProductsByCategory(activeCategory)
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ürünler yüklenemedi:', err);
          setLoading(false);
        });
    } else {
      fetchAllProducts(30)
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ürünler yüklenemedi:', err);
          setLoading(false);
        });
    }
  }, [activeCategory, searchQuery]);

  // Kategori filtre butonuna tıklanma işleyicisi
  const handleCategoryFilter = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('search');
    setSearchParams(params);
  };

  // Sıralama mantığı - orijinal diziyi bozmamak için spread kullanılır
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="products-page">
      <div className="container">
        {/* Sayfa başlığı - duruma göre arama/kategori/tümü */}
        <div className="section__header" style={{ textAlign: 'left' }}>
          <h1 className="section__title">
            {searchQuery
              ? `"${searchQuery}" için sonuçlar`
              : activeCategory
                ? translateCategory(activeCategory)
                : 'Tüm Ürünler'}
          </h1>
          <p className="section__subtitle">
            {products.length} ürün bulundu
          </p>
        </div>

        {/* Filtre araç çubuğu */}
        <div className="products-toolbar">
          <div className="products-toolbar__categories">
            <button
              className={`filter-chip ${!activeCategory ? 'filter-chip--active' : ''}`}
              onClick={() => handleCategoryFilter('')}
            >
              Tümü
            </button>
            {/* Türkçe kategori filtre butonları */}
            {categories.slice(0, 10).map(cat => (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === cat ? 'filter-chip--active' : ''}`}
                onClick={() => handleCategoryFilter(cat)}
              >
                {translateCategory(cat)}
              </button>
            ))}
          </div>

          {/* Sıralama seçenekleri */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sıralama</option>
            <option value="price-low">Fiyat: Düşükten Yükseğe</option>
            <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="discount">En Yüksek İndirim</option>
          </select>
        </div>

        {/* Ürün listesi veya yükleme/boş durum */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="products-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__title">Ürün bulunamadı</h3>
            <p className="empty-state__text">
              Farklı bir arama terimi veya kategori deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
