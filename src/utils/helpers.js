/* ============================================
   TÜRKÇE ÇEVİRİ & PARA BİRİMİ YARDIMCILARI
   Kategori isimlerini Türkçeye çevirir,
   fiyatları TL'ye dönüştürür
   ============================================ */

// Döviz kuru: 1 USD = 35 TL (yaklaşık)
const USD_TO_TRY = 35;

/**
 * Dolar fiyatını Türk Lirasına çevirir
 * Formatlı string döndürür: "349,65 ₺"
 */
export function formatPrice(priceInUSD) {
  const priceTRY = priceInUSD * USD_TO_TRY;
  return priceTRY.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₺';
}

/**
 * Dolar fiyatını TL sayısal değerine çevirir (hesaplamalar için)
 */
export function toTRY(priceInUSD) {
  return priceInUSD * USD_TO_TRY;
}

/**
 * Sayısal TL değerini formatlar
 */
export function formatTRY(amountTRY) {
  return amountTRY.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₺';
}

/**
 * İndirim yüzdesinden orijinal fiyatı hesapla
 * API'den gelen discountPercentage ile eski fiyat göstermek için
 */
export function getOriginalPrice(currentPrice, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return null;
  return currentPrice / (1 - discountPercentage / 100);
}

// Kategori isimlerinin Türkçe karşılıkları
const categoryTranslations = {
  'beauty': 'Güzellik',
  'fragrances': 'Parfüm',
  'furniture': 'Mobilya',
  'groceries': 'Market',
  'home-decoration': 'Ev Dekorasyonu',
  'kitchen-accessories': 'Mutfak Aksesuarları',
  'laptops': 'Laptop',
  'mens-shirts': 'Erkek Gömlek',
  'mens-shoes': 'Erkek Ayakkabı',
  'mens-watches': 'Erkek Saat',
  'mobile-accessories': 'Telefon Aksesuarları',
  'motorcycle': 'Motosiklet',
  'skin-care': 'Cilt Bakımı',
  'smartphones': 'Akıllı Telefon',
  'sports-accessories': 'Spor Aksesuarları',
  'sunglasses': 'Güneş Gözlüğü',
  'tablets': 'Tablet',
  'tops': 'Üst Giyim',
  'vehicle': 'Araç',
  'womens-bags': 'Kadın Çanta',
  'womens-dresses': 'Kadın Elbise',
  'womens-jewellery': 'Kadın Takı',
  'womens-shoes': 'Kadın Ayakkabı',
  'womens-watches': 'Kadın Saat',
};

/**
 * Kategori slug'ını Türkçeye çevirir
 * Eşleşme yoksa slug'ı title case'e çevirir
 */
export function translateCategory(slug) {
  if (!slug) return '';
  return categoryTranslations[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Stok durumu metni ve rengi
 * Stok seviyesine göre uygun mesaj döndürür
 */
export function getStockStatus(stock) {
  if (stock <= 0) return { text: 'Tükendi', color: 'var(--color-danger)', inStock: false };
  if (stock <= 10) return { text: `Son ${stock} adet!`, color: 'var(--color-warning)', inStock: true };
  if (stock <= 50) return { text: 'Sınırlı Stok', color: 'var(--color-accent)', inStock: true };
  return { text: 'Stokta', color: 'var(--color-success)', inStock: true };
}

/**
 * Yıldız rating'ini yıldız dizisine çevirir
 * Dolu, yarım ve boş yıldız sayısını hesaplar
 */
export function getRatingStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

// Yorum tarihini Türkçe formata çevirir
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Sık kullanılan İngilizce kelimelerin Türkçe karşılıkları
const wordDictionary = {
  'Mascara': 'Maskara',
  'Eyeshadow': 'Göz Farı',
  'Palette': 'Paleti',
  'Mirror': 'Ayna',
  'Powder': 'Pudra',
  'Lipstick': 'Ruj',
  'Nail Polish': 'Oje',
  'Perfume': 'Parfüm',
  'Eau De Parfum': 'Parfüm',
  'Eau de': 'Parfüm',
  'Bed': 'Yatak',
  'Sofa': 'Kanepe',
  'Table': 'Masa',
  'Chair': 'Sandalye',
  'Sink': 'Lavabo',
  'Apple': 'Elma',
  'Beef': 'Dana',
  'Steak': 'Biftek',
  'Chicken': 'Tavuk',
  'Meat': 'Et',
  'Oil': 'Yağ',
  'Food': 'Mama',
  'Dogs': 'Köpek',
  'Cats': 'Kedi',
  'Eggs': 'Yumurta',
  'Fish': 'Balık',
  'Green': 'Yeşil',
  'Pepper': 'Biber',
  'Honey': 'Bal',
  'Ice Cream': 'Dondurma',
  'Juice': 'Meyve Suyu',
  'Kiwi': 'Kivi',
  'Lemon': 'Limon',
  'Milk': 'Süt',
  'Red': 'Kırmızı',
  'Blue': 'Mavi',
  'Black': 'Siyah',
  'White': 'Beyaz',
  'Water': 'Su',
  'Laptop': 'Laptop',
  'Smartphone': 'Akıllı Telefon',
  'Watch': 'Saat',
  'Shoes': 'Ayakkabı',
  'Shirt': 'Gömlek',
  'Dress': 'Elbise',
  'Bag': 'Çanta',
  'Ring': 'Yüzük',
  'Necklace': 'Kolye',
  'Earrings': 'Küpe',
  'With': 've',
  'And': 've'
};

// DummyJSON özel ürün isimlerini tam eşleşmeyle çevirme önceliği
const productTranslations = {
  'Essence Mascara Lash Princess': 'Essence Lash Princess Maskara',
  'Eyeshadow Palette with Mirror': 'Aynalı Göz Farı Paleti',
  'Powder Canister': 'Pudra Kutusu',
  'Red Lipstick': 'Kırmızı Ruj',
  'Red Nail Polish': 'Kırmızı Oje',
  'Calvin Klein CK One': 'Calvin Klein CK One Parfüm',
  'Chanel Coco Noir Eau De': 'Chanel Coco Noir Parfüm',
  'Dior J\'adore': 'Dior J\'adore Parfüm',
  'Dolce Shine Eau de': 'Dolce Shine Parfüm',
  'Gucci Bloom Eau de': 'Gucci Bloom Parfüm',
  'Annibale Colombo Bed': 'Annibale Colombo Yatak',
  'Annibale Colombo Sofa': 'Annibale Colombo Kanepe',
  'Bedside Table African Cherry': 'Afrika Kirazı Başucu Masası',
  'Knoll Saarinen Executive Conference Chair': 'Knoll Saarinen Yönetici Koltuğu',
  'Wooden Bathroom Sink With Dispenser': 'Ahşap Banyo Lavabosu ve Sabunluk',
  'Cat Food': 'Kedi Maması',
  'Dog Food': 'Köpek Maması',
  'Green Bell Pepper': 'Yeşil Dolmalık Biber',
  'Green Chili Pepper': 'Yeşil Sivri Biber',
  'Honey Jar': 'Bal Kavanozu',
};

/**
 * Ürün başlığını Türkçeye çevirir. 
 * Tam eşleşme varsa onu, yoksa kelime tabanlı çeviriyi kullanır.
 */
export function translateProductName(title) {
  if (!title) return '';
  if (productTranslations[title]) return productTranslations[title];

  let translated = title;
  // Kelime bazlı çeviri
  Object.keys(wordDictionary).forEach(word => {
    // Büyük/küçük harf duyarsız arama, kelime sınırları ile
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    translated = translated.replace(regex, wordDictionary[word]);
  });
  
  return translated;
}

// Türkçe kelimeleri geri İngilizceye çevirmek için sözlük (Arama için)
const reverseWordDictionary = {};
Object.keys(wordDictionary).forEach(enWord => {
  const trWord = wordDictionary[enWord].toLowerCase();
  reverseWordDictionary[trWord] = enWord.toLowerCase();
});

// Arama yaparken özel kelimeleri İngilizceye çevirme
export function translateSearchQueryToEnglish(query) {
  if (!query) return '';
  let engQuery = query.toLowerCase().trim();

  // 1. Önce doğrudan çeviri sözlüğünden kelime kelime çevirmeye çalış
  const words = engQuery.split(/\s+/);
  const translatedWords = words.map(word => reverseWordDictionary[word] || word);
  engQuery = translatedWords.join(' ');

  // 2. Kategori isimlerini İngilizceye çevirmeyi dene
  Object.keys(categoryTranslations).forEach(enCat => {
    const trCat = categoryTranslations[enCat].toLowerCase();
    // ör: "güneş gözlüğü" -> "sunglasses"
    if (engQuery.includes(trCat)) {
        engQuery = engQuery.replace(trCat, enCat.replace('-', ' '));
    }
  });

  return engQuery;
}
