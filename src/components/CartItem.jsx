/* ============================================
   SEPET ÖĞESİ BİLEŞENİ - CartItem
   Sepet sayfasında her ürün için görünüm:
   görsel, ad, TL fiyat, miktar kontrolleri
   ============================================ */

import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

/**
 * CartItem bileşeni
 * item prop'u: { id, title, price, thumbnail, quantity }
 * Fiyatlar TL olarak gösterilir
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      {/* Ürün görseli */}
      <div className="cart-item__image">
        <img src={item.thumbnail} alt={item.title} />
      </div>

      {/* Ürün bilgileri: ad ve birim TL fiyat */}
      <div className="cart-item__info">
        <h3 className="cart-item__title">{item.title}</h3>
        <span className="cart-item__price">{formatPrice(item.price)}</span>
      </div>

      {/* Miktar kontrolleri ve silme butonu */}
      <div className="cart-item__controls">
        <div className="cart-item__qty">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            <FiMinus />
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <FiPlus />
          </button>
        </div>

        {/* Toplam fiyat (birim × adet) */}
        <span className="cart-item__subtotal">
          {formatPrice(item.price * item.quantity)}
        </span>

        <button
          className="cart-item__remove"
          onClick={() => removeFromCart(item.id)}
          title="Sepetten kaldır"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
