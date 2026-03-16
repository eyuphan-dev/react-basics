/* ============================================
   GİRİŞ/KAYIT MODAL BİLEŞENİ - AuthModal
   Tab geçişli giriş ve kayıt formları.
   DummyJSON API ile kimlik doğrulama yapar.
   ============================================ */

import { useState } from 'react';
import { FiX, FiUser, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

/**
 * AuthModal: Giriş ve kayıt formlarını içeren overlay modal
 * isOpen: modal görünürlüğü
 * onClose: modal kapatma callback'i
 */
export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
  });
  const [error, setError] = useState('');

  const { login, register, loading } = useAuth();
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  // Giriş formu gönderimi
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginForm.username || !loginForm.password) {
      setError('Tüm alanları doldurun');
      return;
    }

    const result = await login(loginForm.username, loginForm.password);
    if (result.success) {
      toast.success(`Hoş geldin, ${result.user.firstName}! 🎉`);
      addNotification({
        type: 'success',
        title: 'Giriş Başarılı',
        message: `Hoş geldin ${result.user.firstName}! Alışverişe başlayabilirsin.`,
      });
      onClose();
    } else {
      setError(result.error);
    }
  };

  // Kayıt formu gönderimi
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerForm.firstName || !registerForm.email || !registerForm.password) {
      setError('Tüm zorunlu alanları doldurun');
      return;
    }

    const result = await register(registerForm);
    if (result.success) {
      toast.success('Kayıt başarılı! Hoş geldin! 🎉');
      addNotification({
        type: 'success',
        title: 'Kayıt Başarılı',
        message: `Hesabın oluşturuldu. Alışverişe başlayabilirsin!`,
      });
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal üst çubuğu */}
        <div className="modal__header">
          <h2 className="modal__title">
            {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </h2>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Tab geçiş butonları */}
        <div className="modal__tabs">
          <button
            className={`modal__tab ${activeTab === 'login' ? 'modal__tab--active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Giriş Yap
          </button>
          <button
            className={`modal__tab ${activeTab === 'register' ? 'modal__tab--active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Hata mesajı */}
        {error && <div className="modal__error">{error}</div>}

        {/* Giriş formu */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="modal__form">
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <div className="form-input-wrapper">
                <FiUser className="form-input-icon" />
                <input
                  type="text"
                  placeholder="Kullanıcı adınız"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <div className="form-input-wrapper">
                <FiLock className="form-input-icon" />
                <input
                  type="password"
                  placeholder="Şifreniz"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            {/* Demo bilgisi */}
            <p className="modal__hint">
              Demo giriş: <strong>demo</strong> / <strong>demo123</strong>
            </p>
          </form>
        )}

        {/* Kayıt formu */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="modal__form">
            <div className="form-row">
              <div className="form-group">
                <label>Ad *</label>
                <div className="form-input-wrapper">
                  <FiUser className="form-input-icon" />
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <div className="form-input-wrapper">
                  <FiUser className="form-input-icon" />
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>E-posta *</label>
              <div className="form-input-wrapper">
                <FiMail className="form-input-icon" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Şifre *</label>
              <div className="form-input-wrapper">
                <FiLock className="form-input-icon" />
                <input
                  type="password"
                  placeholder="En az 6 karakter"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
