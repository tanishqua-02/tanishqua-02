import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Orders = () => {
  const { token } = useAuth();
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600" data-testid="loading-indicator">
          {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="no-orders">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {language === 'en' ? 'No orders yet' : 'अभी तक कोई ऑर्डर नहीं'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="orders-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="orders-title">
          {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`order-${order.id}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800" data-testid={`order-id-${order.id}`}>
                    {language === 'en' ? 'Order' : 'ऑर्डर'} #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold" data-testid={`order-status-${order.id}`}>
                    {order.status === 'completed' ? (language === 'en' ? 'Completed' : 'पूर्ण') : order.status}
                  </span>
                  <p className="text-xl font-bold text-green-700 mt-2" data-testid={`order-total-${order.id}`}>
                    ₹{order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">
                  {language === 'en' ? 'Items:' : 'आइटम:'}
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm" data-testid={`order-item-${order.id}-${index}`}>
                      <span>{language === 'en' ? 'Item' : 'आइटम'} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {language === 'en' ? 'Shipping Address:' : 'शिपिंग पता:'}
                  </span>
                  <br />
                  {order.shipping_address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;