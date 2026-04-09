import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert(language === 'en' ? 'Cart is empty' : 'कार्ट खाली है');
      return;
    }

    try {
      setLoading(true);
      
      const orderItems = cartItems.map(({ cart_item, product }) => ({
        product_id: product.id,
        quantity: cart_item.quantity,
        price: product.price
      }));

      await axios.post(
        `${API}/orders`,
        {
          items: orderItems,
          total_amount: cartTotal,
          shipping_address: shippingAddress,
          payment_method: 'mock'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(language === 'en' ? 'Order placed successfully!' : 'ऑर्डर सफलतापूर्वक दिया गया!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(language === 'en' ? 'Checkout failed. Please try again.' : 'चेकआउट विफल. कृपया पुनः प्रयास करें.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {language === 'en' ? 'No items in cart' : 'कार्ट में कोई आइटम नहीं'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="checkout-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="checkout-title">
          {language === 'en' ? 'Checkout' : 'चेकआउट'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === 'en' ? 'Order Summary' : 'ऑर्डर सारांश'}
            </h2>
            <div className="space-y-3">
              {cartItems.map(({ cart_item, product }) => (
                <div key={cart_item.id} className="flex justify-between" data-testid={`checkout-item-${cart_item.id}`}>
                  <span>
                    {language === 'en' ? product.name_en : product.name_hi} x {cart_item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{(product.price * cart_item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>{language === 'en' ? 'Total' : 'कुल'}</span>
                <span data-testid="checkout-total">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <form onSubmit={handleCheckout}>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'Shipping Address' : 'शिपिंग पता'}
              </label>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter your full shipping address' : 'अपना पूरा शिपिंग पता दर्ज करें'}
                data-testid="shipping-address-input"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'Payment Method' : 'भुगतान विधि'}
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  💳 {language === 'en' ? 'Mock Payment (Demo)' : 'मॉक पेमेंट (डेमो)'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              data-testid="place-order-button"
            >
              {loading ? '...' : (language === 'en' ? 'Place Order' : 'ऑर्डर दें')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;