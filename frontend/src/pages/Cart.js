import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, cartTotal, loading } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      alert(language === 'en' ? 'Failed to update cart' : 'कार्ट अपडेट विफल');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      alert(language === 'en' ? 'Failed to remove item' : 'आइटम हटाने में विफल');
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="empty-cart">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {language === 'en' ? 'Your cart is empty' : 'आपकी कार्ट खाली है'}
          </h2>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition"
            data-testid="continue-shopping-button"
          >
            {language === 'en' ? 'Continue Shopping' : 'खरीदारी जारी रखें'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="cart-title">
          {language === 'en' ? 'Shopping Cart' : 'शॉपिंग कार्ट'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ cart_item, product }) => (
              <div key={cart_item.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`cart-item-${cart_item.id}`}>
                <div className="flex items-center space-x-6">
                  <img
                    src={product.image}
                    alt={language === 'en' ? product.name_en : product.name_hi}
                    className="w-24 h-24 object-cover rounded"
                    data-testid={`cart-item-image-${cart_item.id}`}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800" data-testid={`cart-item-name-${cart_item.id}`}>
                      {language === 'en' ? product.name_en : product.name_hi}
                    </h3>
                    <p className="text-xl font-bold text-green-700 mt-2" data-testid={`cart-item-price-${cart_item.id}`}>
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(cart_item.id, cart_item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      data-testid={`decrease-quantity-${cart_item.id}`}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold" data-testid={`cart-item-quantity-${cart_item.id}`}>
                      {cart_item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(cart_item.id, cart_item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      data-testid={`increase-quantity-${cart_item.id}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(cart_item.id)}
                    className="text-red-600 hover:text-red-800"
                    data-testid={`remove-item-${cart_item.id}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {language === 'en' ? 'Cart Summary' : 'कार्ट सारांश'}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Subtotal' : 'उपयोग'}
                  </span>
                  <span className="font-semibold" data-testid="cart-subtotal">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>{language === 'en' ? 'Total' : 'कुल'}</span>
                  <span data-testid="cart-total">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
                data-testid="checkout-button"
              >
                {language === 'en' ? 'Proceed to Checkout' : 'चेकआउट पर जाएं'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;