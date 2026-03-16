import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiHome, FiBox, FiShoppingBag, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Basit admin yetki kontrolü (Örnek: sadece 'emilys' kullanıcısı girebilir)
  // Gerçek senaryoda user.role === 'admin' gibi bir kontrol yapılır.
  if (!user || user.username !== 'emilys') {
    toast.error('Bu alana erişim yetkiniz yok.');
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success('Admin panelinden çıkış yapıldı.');
  };

  const navLinks = [
    { path: '/admin', icon: <FiHome />, text: 'Dashboard', exact: true },
    { path: '/admin/products', icon: <FiBox />, text: 'Ürün Yönetimi' },
    { path: '/admin/orders', icon: <FiShoppingBag />, text: 'Siparişler (Yakında)' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>ShopZone <span>Admin</span></h2>
        </div>
        
        <nav className="admin-sidebar__nav">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.path 
              : location.pathname.startsWith(link.path);
              
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={isActive ? 'active' : ''}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="back-to-site">
            Siteye Dön
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            Yönetim Paneli
          </div>
          <div className="admin-topbar__actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Tema Değiştir">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <div className="admin-profile">
              <img src={user.image} alt={user.firstName} />
              <span>{user.firstName} {user.lastName}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
