import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useLanguage } from '../../i18n/LanguageContext';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.orderStatus === statusFilter)
    : orders;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <p className="admin-kicker">{t.adminOrders}</p>
      <h1 className="admin-title mt-3 mb-10">{t.adminOrdersTitle}</h1>

      {error && <ErrorMessage message={error} />}

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select max-w-xs"
        >
          <option value="">{t.adminAllOrders}</option>
          <option value="PENDING">{t.adminPending}</option>
          <option value="CONFIRMED">{t.adminConfirmed}</option>
          <option value="PROCESSING">{t.adminProcessing}</option>
          <option value="SHIPPED">{t.adminShipped}</option>
          <option value="DELIVERED">{t.adminDelivered}</option>
          <option value="CANCELLED">{t.adminCancelled}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left font-semibold">{t.adminOrderId}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminDate}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminTotal}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminStatus}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminAction}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 font-semibold">{order._id.slice(-8)}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">EGP {order.totalPrice}</td>
                <td className="px-6 py-4">
                  <span
                    className={`admin-badge ${
                      order.orderStatus === 'DELIVERED'
                        ? 'border-[#697064] text-[#697064]'
                        : order.orderStatus === 'CANCELLED'
                        ? 'border-red-700 text-red-700'
                        : 'admin-badge-burgundy'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="admin-select"
                  >
                    <option value="PENDING">{t.adminPending}</option>
                    <option value="CONFIRMED">{t.adminConfirmed}</option>
                    <option value="PROCESSING">{t.adminProcessing}</option>
                    <option value="SHIPPED">{t.adminShipped}</option>
                    <option value="DELIVERED">{t.adminDelivered}</option>
                    <option value="CANCELLED">{t.adminCancelled}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
