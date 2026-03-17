# ShopZone

ShopZone, React ve Vite ile gelistirilmiş bir e-ticaret web uygulamasıdır.
Ürün verileri DummyJSON API'den alınır. Uygulama durumu ve kullanıcıya ait bazı veriler localStorage ile saklanır.

## Hakkında

Bu proje, tek sayfa uygulamasi (SPA) mimarisi ile calisir ve temel e-ticaret akislarini kapsar.

- Ürün listeleme, filtreleme ve arama
- Ürün detay görüntüleme
- Sepet yönetimi
- Favoriler
- Sipariş olusturma ve takip
- Tema degişimi (acik/koyu)
- Basit admin sayfaları

## Kullanılan Teknolojiler

- React
- Vite
- React Router DOM
- Context API + useReducer
- Vanilla CSS
- DummyJSON API
- localStorage

## Proje Yapısı

```text
src/
  api/
    productApi.js
  components/
    AuthModal.jsx
    CartItem.jsx
    CategorySection.jsx
    Footer.jsx
    Header.jsx
    HeroSection.jsx
    NotificationDropdown.jsx
    ProductCard.jsx
    SearchAutocomplete.jsx
  context/
    AuthContext.jsx
    CartContext.jsx
    FavoritesContext.jsx
    NotificationContext.jsx
    OrderContext.jsx
    RecentlyViewedContext.jsx
    ThemeContext.jsx
  pages/
    admin/
      AdminLayout.jsx
      DashboardPage.jsx
      ProductsAdminPage.jsx
    CartPage.jsx
    FavoritesPage.jsx
    HomePage.jsx
    OrdersPage.jsx
    ProductDetailPage.jsx
    ProductsPage.jsx
  utils/
    helpers.js
  App.jsx
  main.jsx
  index.css
```

## Kurulum

Gereksinimler:

- Node.js 18 veya uzeri
- npm

Adımlar:

```bash
npm install
npm run dev
```

Varsayılan geliştirme adresi: http://localhost:5173

## Komutlar

- `npm run dev`: Geliştirme sunucusunu baslatir.
- `npm run build`: Üretim surumu icin derleme yapar.
- `npm run preview`: Derlenmiş surumu yerel olarak önizler.
- `npm run lint`: Kod stil ve kalite kontrolu yapar.

## Demo Giriş

- Kullanıcı adı: `demo`
- Şifre: `demo123`

Not: Giriş işlemi DummyJSON kimlik doğrulama endpoint'i ile yapilir. Kayit akışında demo amaçlı simulasyon bulunabilir.

## API Uçları

Ürun işlemleri:

- `GET /products?limit=&skip=`
- `GET /products/{id}`
- `GET /products/category-list`
- `GET /products/category/{slug}`
- `GET /products/search?q=`

Kimlik doğrulama:

- `POST /auth/login`

## Rotalar

- `/`: Ana sayfa
- `/urunler`: Ürün listesi
- `/urun/:id`: Ürün detay
- `/sepet`: Sepet
- `/favoriler`: Favoriler
- `/siparislerim`: Siparişlerim
- `/admin`: Admin paneli
- `/admin/products`: Admin ürün yonetimi


