import React from 'react';
import { FiTrendingUp, FiUsers, FiDollarSign, FiShoppingBag, FiActivity } from 'react-icons/fi';
import { useOrders } from '../../context/OrderContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { orders } = useOrders();

  // Sahte istatistik verileri (Dashboard Moku)
  const stats = [
    {
      title: 'Toplam Satış',
      value: '124.500 ₺',
      trend: '+12.5%',
      isPositive: true,
      icon: <FiDollarSign />,
      color: 'var(--color-success)',
    },
    {
      title: 'Aylık Ziyaretçi',
      value: '45.2K',
      trend: '+5.2%',
      isPositive: true,
      icon: <FiUsers />,
      color: 'var(--color-primary)',
    },
    {
      title: 'Yeni Siparişler',
      value: '142',
      trend: '-2.4%',
      isPositive: false,
      icon: <FiShoppingBag />,
      color: 'var(--color-warning)',
    },
    {
      title: 'Dönüşüm Oranı',
      value: '%3.4',
      trend: '+1.1%',
      isPositive: true,
      icon: <FiActivity />,
      color: 'var(--color-accent)',
    },
  ];

  // Gerçek siparişleri sondan başa sırala (en yeni üstte)
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Dashboard Genel Bakış</h1>
        <p className="admin-page__subtitle">Mağazanızın bugünkü performans özeti.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-stat-card__info">
              <h3>{stat.title}</h3>
              <div className="admin-stat-card__value">
                <strong>{stat.value}</strong>
                <span className={`admin-stat-card__trend ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.trend} <FiTrendingUp style={!stat.isPositive && { transform: 'scaleY(-1)' }}/>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="admin-panel-section">
        <div className="admin-panel-section__header">
          <h2>Son Siparişler (Gerçek Veri)</h2>
          <Link to="/admin/orders" className="admin-link">Tümünü Gör</Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Tarih</th>
                  <th>Ürünler</th>
                  <th>Toplam Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>#{order.id.slice(0, 8)}</strong></td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.items.length} çeşit ürün</td>
                    <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                    <td>
                      <span className={`admin-badge admin-badge--${
                        order.status === 'Teslim Edildi' ? 'success' : 
                        order.status === 'Kargoda' ? 'primary' : 'warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <FiShoppingBag />
            <p>Henüz hiç sipariş alınmamış.</p>
          </div>
        )}
      </div>
    </div>
  );
}
