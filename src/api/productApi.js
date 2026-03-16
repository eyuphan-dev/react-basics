/* ============================================
   API KATMANI - Ürün Veri Çekme Servisleri
   DummyJSON API kullanarak ürün verilerini çeker
   ============================================ */

import { translateProductName, translateSearchQueryToEnglish } from '../utils/helpers';

// DummyJSON API temel URL'i
const BASE_URL = 'https://dummyjson.com';

/**
 * Tüm ürünleri getirir
 * limit: Kaç ürün getirileceği (varsayılan 30)
 * skip: Kaç ürün atlanacağı (sayfalama için)
 */
export async function fetchAllProducts(limit = 30, skip = 0) {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error('Ürünler yüklenemedi');
    const data = await response.json();
    return data.products.map(p => ({ ...p, title: translateProductName(p.title) }));
  } catch (error) {
    console.error('fetchAllProducts hatası:', error);
    throw error;
  }
}

/**
 * Tek bir ürünün detayını getirir
 * id: Ürün ID'si
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Ürün bulunamadı');
    const data = await response.json();
    data.title = translateProductName(data.title);
    return data;
  } catch (error) {
    console.error('fetchProductById hatası:', error);
    throw error;
  }
}

/**
 * Tüm kategori listesini getirir
 * DummyJSON, kategorileri slug ve name olarak döndürür
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/products/category-list`);
    if (!response.ok) throw new Error('Kategoriler yüklenemedi');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchCategories hatası:', error);
    throw error;
  }
}

/**
 * Belirli bir kategorideki ürünleri getirir
 * category: Kategori slug'ı (ör: "smartphones", "laptops")
 */
export async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!response.ok) throw new Error('Kategori ürünleri yüklenemedi');
    const data = await response.json();
    return data.products.map(p => ({ ...p, title: translateProductName(p.title) }));
  } catch (error) {
    console.error('fetchProductsByCategory hatası:', error);
    throw error;
  }
}

/**
 * Ürün arama fonksiyonu
 * query: Arama terimi (ör: "telefon", "laptop")
 */
export async function searchProducts(query) {
  try {
    const englishQuery = translateSearchQueryToEnglish(query);
    const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(englishQuery)}`);
    if (!response.ok) throw new Error('Arama başarısız');
    const data = await response.json();
    return data.products.map(p => ({ ...p, title: translateProductName(p.title) }));
  } catch (error) {
    console.error('searchProducts hatası:', error);
    throw error;
  }
}
