/* ============================================
   KULLANICI KİMLİK DOĞRULAMA CONTEXT - AuthContext
   DummyJSON auth API ile giriş/kayıt yönetimi.
   Kullanıcı bilgilerini localStorage ile kalıcı tutar.
   ============================================ */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// localStorage'dan kullanıcı bilgisini oku
function getInitialUser() {
  try {
    const saved = localStorage.getItem('shopzone_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * AuthProvider: Kullanıcı kimlik doğrulama yönetimi
 * DummyJSON API: https://dummyjson.com/docs/auth
 * login, register, logout fonksiyonları sağlar
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  // Kullanıcı değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem('shopzone_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopzone_user');
    }
  }, [user]);

  /**
   * DummyJSON API ile giriş yap
   * Başarılı girişte kullanıcı bilgileri + token döner
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      // Demo kullanıcı eşlemesi: demo/demo123 → DummyJSON gerçek kullanıcısı
      const actualUsername = username === 'demo' ? 'emilys' : username;
      const actualPassword = password === 'demo123' ? 'emilyspass' : password;

      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: actualUsername, password: actualPassword }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Giriş başarısız');
      }

      const data = await res.json();
      setUser(data);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Kayıt simülasyonu - DummyJSON'da gerçek kayıt yok
   * Mevcut bir kullanıcıyla otomatik giriş yapar
   */
  const register = async (formData) => {
    setLoading(true);
    try {
      // DummyJSON'da yeni kullanıcı oluşturma yok, mevcut bir
      // kullanıcı ile giriş simüle edelim
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'emilys',
          password: 'emilyspass',
        }),
      });

      if (!res.ok) throw new Error('Kayıt başarısız');

      const data = await res.json();
      // Kayıt formundaki ismi kullan
      const userWithName = {
        ...data,
        firstName: formData.firstName || data.firstName,
        lastName: formData.lastName || data.lastName,
      };
      setUser(userWithName);
      setLoading(false);
      return { success: true, user: userWithName };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Çıkış yap
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopzone_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth custom hook
 * Kullanım: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook\'u AuthProvider içinde kullanılmalıdır');
  }
  return context;
}
