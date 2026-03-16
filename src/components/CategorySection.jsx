/* ============================================
   KATEGORİ BÖLÜMü BİLEŞENİ - CategorySection
   API'den gelen kategorileri Türkçe isimlerle
   ve ikon kartları olarak gösterir.
   ============================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSmartphone, FiMonitor, FiWatch, FiShoppingBag, FiStar,
  FiSun, FiTruck
} from 'react-icons/fi';
import { GiFragrance, GiLipstick, GiSofa, GiRunningShoe } from 'react-icons/gi';
import { fetchCategories } from '../api/productApi';
import { translateCategory } from '../utils/helpers';

/**
 * Her kategori için bir ikon eşlemesi
 * API'den gelen kategori slug'ına göre uygun ikon gösterilir
 */
const categoryIcons = {
  beauty: <GiLipstick />,
  fragrances: <GiFragrance />,
  furniture: <GiSofa />,
  groceries: <FiShoppingBag />,
  'home-decoration': <FiStar />,
  'kitchen-accessories': <FiShoppingBag />,
  laptops: <FiMonitor />,
  'mens-shirts': <FiShoppingBag />,
  'mens-shoes': <GiRunningShoe />,
  'mens-watches': <FiWatch />,
  'mobile-accessories': <FiSmartphone />,
  motorcycle: <FiTruck />,
  'skin-care': <GiLipstick />,
  smartphones: <FiSmartphone />,
  'sports-accessories': <GiRunningShoe />,
  sunglasses: <FiSun />,
  tablets: <FiMonitor />,
  tops: <FiShoppingBag />,
  vehicle: <FiTruck />,
  'womens-bags': <FiShoppingBag />,
  'womens-dresses': <FiShoppingBag />,
  'womens-jewellery': <FiStar />,
  'womens-shoes': <GiRunningShoe />,
  'womens-watches': <FiWatch />,
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Bileşen yüklendiğinde API'den kategorileri çek
  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data.slice(0, 8)))
      .catch(err => console.error('Kategoriler yüklenemedi:', err));
  }, []);

  // Kategori kartına tıklandığında filtrelenmiş ürün sayfasına yönlendir
  const handleCategoryClick = (category) => {
    navigate(`/urunler?category=${category}`);
  };

  return (
    <section className="section">
      <div className="container">
        {/* Bölüm başlığı */}
        <div className="section__header">
          <h2 className="section__title">Kategoriler</h2>
          <p className="section__subtitle">
            Aradığınız ürünü kolayca bulun
          </p>
        </div>

        {/* Kategori kartları - Türkçe isimlerle */}
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-card__icon">
                {categoryIcons[category] || <FiStar />}
              </div>
              {/* translateCategory ile Türkçe kategori adı */}
              <span className="category-card__name">
                {translateCategory(category)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
