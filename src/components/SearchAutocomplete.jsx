/* ============================================
   GELİŞMİŞ ARAMA BİLEŞENİ - SearchAutocomplete
   Anlık arama sonuçları dropdown ile gösterilir.
   Arama geçmişi localStorage'da saklanır.
   Tüm ürünler uygulama başında çekilerek 
   Türkçe ve kısmî aramalar için yerel filtreleme yapılır.
   ============================================ */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiX, FiArrowRight } from 'react-icons/fi';
import { fetchAllProducts } from '../api/productApi';
import { formatPrice } from '../utils/helpers';

// localStorage'dan arama geçmişini oku
function getSearchHistory() {
  try {
    const saved = localStorage.getItem('shopzone_search_history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * SearchAutocomplete: Gelişmiş arama bileşeni
 * - Yazarken anlık ürün önerisi (debounce ile)
 * - Yerel veri üzerinde filtreleme ile "kırmızı" -> "kır" aramasında çıkmasını sağlama
 * - Arama geçmişi gösterimi
 * - Geçmiş temizleme
 */
export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [history, setHistory] = useState(getSearchHistory);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Bileşen yüklendiğinde tüm ürünleri bir kere çek ve önbelleğe al
  useEffect(() => {
    // 150 ürüne kadar çekelim (varsayılan api limitini aşabilir, limit 150 diyebiliriz)
    fetchAllProducts(150)
      .then(data => setAllProducts(data))
      .catch(err => console.error("Ürünler arama için yüklenemedi:", err));
  }, []);

  // Dışarı tıklama ile dropdown kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce ile arama - 150ms bekle, yerel filtreleme yap
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const searchTerm = query.toLowerCase().trim();
      const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
      );
      
      setResults(filtered.slice(0, 5));
      setLoading(false);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, allProducts]);

  // Arama geçmişine ekle
  const addToHistory = (term) => {
    if (!term) return;
    const updated = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('shopzone_search_history', JSON.stringify(updated));
  };

  // Geçmişi temizle
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('shopzone_search_history');
  };

  // Arama gönder
  const handleSearch = (searchTerm) => {
    const term = searchTerm || query;
    if (!term.trim()) return;
    addToHistory(term.trim());
    navigate(`/urunler?search=${encodeURIComponent(term.trim())}`);
    setShowDropdown(false);
    setQuery('');
  };

  // Ürüne git
  const goToProduct = (product) => {
    addToHistory(product.title);
    navigate(`/urun/${product.id}`);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className="search-autocomplete" ref={wrapperRef}>
      <div className="search-autocomplete__input-wrapper">
        <FiSearch className="search-autocomplete__icon" />
        <input
          type="text"
          placeholder="Ürün ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {query && (
          <button className="search-autocomplete__clear" onClick={() => setQuery('')}>
            <FiX />
          </button>
        )}
      </div>

      {/* Dropdown - arama sonuçları veya geçmiş */}
      {showDropdown && (
        <div className="search-dropdown">
          {/* Arama sonuçları */}
          {query.trim().length >= 2 && (
            <>
              {loading ? (
                <div className="search-dropdown__loading">Aranıyor...</div>
              ) : results.length > 0 ? (
                <>
                  {results.map(product => (
                    <div
                      key={product.id}
                      className="search-dropdown__item"
                      onClick={() => goToProduct(product)}
                    >
                      <img src={product.thumbnail} alt={product.title} className="search-dropdown__thumb" />
                      <div className="search-dropdown__info">
                        <span className="search-dropdown__name">{product.title}</span>
                        <span className="search-dropdown__price">{formatPrice(product.price)}</span>
                      </div>
                      <FiArrowRight className="search-dropdown__arrow" />
                    </div>
                  ))}
                  <button
                    className="search-dropdown__see-all"
                    onClick={() => handleSearch()}
                  >
                    Tüm sonuçları gör ({query})
                  </button>
                </>
              ) : (
                <div className="search-dropdown__empty">Sonuç bulunamadı</div>
              )}
            </>
          )}

          {/* Arama geçmişi - query boşken göster */}
          {query.trim().length < 2 && history.length > 0 && (
            <>
              <div className="search-dropdown__header">
                <span><FiClock /> Son Aramalar</span>
                <button onClick={clearHistory}>Temizle</button>
              </div>
              {history.map((term, idx) => (
                <div
                  key={idx}
                  className="search-dropdown__history-item"
                  onClick={() => { setQuery(term); handleSearch(term); }}
                >
                  <FiClock />
                  <span>{term}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
