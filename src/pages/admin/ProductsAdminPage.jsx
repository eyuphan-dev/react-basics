import { useState, useEffect } from 'react';
import { fetchAllProducts } from '../../api/productApi';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiType, FiDollarSign, FiBox, FiTag } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    // Ürünleri api'den çek (sadece ilk seferde)
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts(50, 0); // 50 ürün getir
        setProducts(data);
      } catch (error) {
        toast.error('Ürünler yüklenemedi!');
      } finally {
        setLoading(false);
      }
    };
    
    // Uygulama local storage'dan başlatılabilirse daha iyi olurdu ama
    // şimdilik RAM (state) üzerinde simüle edeceğiz.
    loadProducts();
  }, []);

  const confirmDelete = (product) => {
    setProductToDelete(product);
  };

  const executeDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success('Ürün silindi!');
      setProductToDelete(null);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormData({ title: '', price: '', stock: '', category: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Doğrulama
    if (!formData.title || !formData.price || !formData.stock) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }

    if (editingProduct) {
      // Düzenleme simülasyonu
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price), stock: Number(formData.stock) } 
          : p
      ));
      toast.success('Ürün güncellendi!');
    } else {
      // Ekleme simülasyonu (Fake ID ile)
      const newProduct = {
        id: Date.now(), // Sahte ID
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        thumbnail: 'https://placehold.co/400x400?text=Yeni+Urun' // Varsayılan resim
      };
      setProducts([newProduct, ...products]);
      toast.success('Yeni ürün eklendi!');
    }
    
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Ürün Yönetimi</h1>
        <button className="btn btn--primary" onClick={handleAddNewClick}>
          <FiPlus /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Araç Çubuğu */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Ürün adı veya kategori ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-toolbar__stats">
          Toplam <strong>{filteredProducts.length}</strong> ürün listeleniyor
        </div>
      </div>

      {/* Tablo */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Ürünler Yükleniyor...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok Durumu</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.thumbnail} alt={product.title} className="admin-table__img" />
                  </td>
                  <td><strong>{product.title}</strong></td>
                  <td style={{textTransform: 'capitalize'}}>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}`}>
                      {product.stock > 0 ? `${product.stock} Adet` : 'Tükendi'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="action-btn edit" onClick={() => handleEditClick(product)} title="Düzenle">
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => confirmDelete(product)} title="Sil">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Aramanıza uygun ürün bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Ekleme / Düzenleme */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <button className="admin-modal__close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__form">
              <div className="admin-form-group">
                <label>Ürün Adı</label>
                <div className="admin-input-wrapper">
                  <FiType className="admin-input-icon" />
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Örn: Kablosuz Kulaklık"
                    required 
                  />
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Fiyat (₺)</label>
                  <div className="admin-input-wrapper">
                    <FiDollarSign className="admin-input-icon" />
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      required 
                    />
                  </div>
                </div>
                
                <div className="admin-form-group">
                  <label>Stok Adedi</label>
                  <div className="admin-input-wrapper">
                    <FiBox className="admin-input-icon" />
                    <input 
                      type="number" 
                      value={formData.stock} 
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      placeholder="0"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="admin-form-group">
                <label>Kategori</label>
                <div className="admin-input-wrapper">
                  <FiTag className="admin-input-icon" />
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="Örn: Elektronik, Kozmetik vs."
                    required 
                  />
                </div>
              </div>
              
              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn btn--primary">
                  {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {productToDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal__header">
              <h2>Ürünü Sil</h2>
              <button className="admin-modal__close" onClick={() => setProductToDelete(null)}>&times;</button>
            </div>
            <div className="admin-modal__form" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <FiTrash2 style={{ fontSize: '3rem', color: 'var(--color-danger)', marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Emin misiniz?</p>
              <p style={{ color: 'var(--color-text-muted)' }}><strong>{productToDelete.title}</strong> kalıcı olarak silinecek. (Simülasyon)</p>
              
              <div className="admin-modal__actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                <button className="btn btn--outline" onClick={() => setProductToDelete(null)}>İptal</button>
                <button className="btn" style={{ background: 'var(--color-danger)', color: 'white', border: 'none' }} onClick={executeDelete}>Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
