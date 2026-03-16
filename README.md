# ShopZone

ShopZone, React ve Vite ile gelistirilmis bir e-ticaret web uygulamasidir.
Urun verileri DummyJSON API'den alinir. Uygulama durumu ve kullaniciya ait bazi veriler localStorage ile saklanir.

## Hakkinda

Bu proje, tek sayfa uygulamasi (SPA) mimarisi ile calisir ve temel e-ticaret akislarini kapsar.

- Urun listeleme, filtreleme ve arama
- Urun detay goruntuleme
- Sepet yonetimi
- Favoriler
- Siparis olusturma ve takip
- Tema degisimi (acik/koyu)
- Basit admin sayfalari

## Kullanilan Teknolojiler

- React
- Vite
- React Router DOM
- Context API + useReducer
- Vanilla CSS
- DummyJSON API
- localStorage

## Proje Yapisi

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

Adimlar:

```bash
npm install
npm run dev
```

Varsayilan gelistirme adresi: http://localhost:5173

## Komutlar

- `npm run dev`: Gelistirme sunucusunu baslatir.
- `npm run build`: Uretim surumu icin derleme yapar.
- `npm run preview`: Derlenmis surumu yerel olarak onizler.
- `npm run lint`: Kod stil ve kalite kontrolu yapar.

## Demo Giris

- Kullanici adi: `demo`
- Sifre: `demo123`

Not: Giris islemi DummyJSON kimlik dogrulama endpoint'i ile yapilir. Kayit akisinda demo amacli simulasyon bulunabilir.

## API Uclari

Urun islemleri:

- `GET /products?limit=&skip=`
- `GET /products/{id}`
- `GET /products/category-list`
- `GET /products/category/{slug}`
- `GET /products/search?q=`

Kimlik dogrulama:

- `POST /auth/login`

## Rotalar

- `/`: Ana sayfa
- `/urunler`: Urun listesi
- `/urun/:id`: Urun detay
- `/sepet`: Sepet
- `/favoriler`: Favoriler
- `/siparislerim`: Siparislerim
- `/admin`: Admin paneli
- `/admin/products`: Admin urun yonetimi


