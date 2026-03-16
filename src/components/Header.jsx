/* ============================================
   HEADER BİLEŞENİ - Tam Donanımlı Navbar
   Gelişmiş arama, bildirim merkezi, tema toggle,
   kullanıcı profili ve sepet/favori badge'leri
   ============================================ */

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiBell, FiSun, FiMoon, FiUser, FiLogOut, FiPackage, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import SearchAutocomplete from './SearchAutocomplete';
import NotificationDropdown from './NotificationDropdown';
import AuthModal from './AuthModal';

export default function Header() {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Dışarı tıklama ile dropdown'ları kapat
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <header className="header">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="header__logo">ShopZone</Link>

          {/* Navigasyon linkleri */}
          <nav className="header__nav">
            <NavLink to="/" end>Ana Sayfa</NavLink>
            <NavLink to="/urunler">Ürünler</NavLink>
          </nav>

          {/* Gelişmiş arama bileşeni */}
          <SearchAutocomplete />

          {/* Header aksiyon butonları */}
          <div className="header__actions">
            {/* Tema değiştirme butonu */}
            <button
              className="header__action-btn"
              onClick={toggleTheme}
              title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>

            {/* Bildirim butonu + dropdown */}
            <div className="header__action-wrapper" ref={notifRef}>
              <button
                className="header__action-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Bildirimler"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="header__badge header__badge--warning">{unreadCount}</span>
                )}
              </button>
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Favoriler */}
            <Link to="/favoriler" className="header__action-btn" title="Favoriler">
              <FiHeart />
              {favorites.length > 0 && (
                <span className="header__badge">{favorites.length}</span>
              )}
            </Link>

            {/* Sepet */}
            <Link to="/sepet" className="header__action-btn" title="Sepet">
              <FiShoppingCart />
              {totalItems > 0 && (
                <span className="header__badge">{totalItems}</span>
              )}
            </Link>

            {/* Kullanıcı profili veya giriş butonu */}
            {isAuthenticated ? (
              <div className="header__action-wrapper" ref={userMenuRef}>
                <button
                  className="header__user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.image ? (
                    <img src={user.image} alt={user?.firstName || 'User'} className="header__user-avatar" />
                  ) : (
                    <FiUser />
                  )}
                </button>

                {/* Kullanıcı dropdown menu */}
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown__header">
                      <strong>{user?.firstName || 'Misafir'} {user?.lastName || ''}</strong>
                      <span>{user?.email || ''}</span>
                    </div>
                    
                    {/* Sadece Admin yetkisi olan 'emilys' kullanıcısı için Yönetici Paneli linki */}
                    {user && user.username === 'emilys' && (
                      <Link to="/admin" className="user-dropdown__item" onClick={() => setShowUserMenu(false)} style={{ borderBottom: '1px solid var(--color-bg-hover)', color: 'var(--color-primary)' }}>
                        <FiSettings /> Yönetim Paneli
                      </Link>
                    )}

                    <Link to="/siparislerim" className="user-dropdown__item" onClick={() => setShowUserMenu(false)}>
                      <FiPackage /> Siparişlerim
                    </Link>
                    <Link to="/favoriler" className="user-dropdown__item" onClick={() => setShowUserMenu(false)}>
                      <FiHeart /> Favorilerim
                    </Link>
                    <button className="user-dropdown__item user-dropdown__item--danger" onClick={() => { logout(); setShowUserMenu(false); }}>
                      <FiLogOut /> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn--primary btn--sm"
                onClick={() => setShowAuthModal(true)}
              >
                <FiUser /> Giriş
              </button>
            )}

            {/* Mobil menu toggle */}
            <button
              className="header__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
