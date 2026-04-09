import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      alert(language === 'en' ? 'Added to cart!' : 'कार्ट में जोड़ा गया!');
    } catch (error) {
      alert(language === 'en' ? 'Failed to add to cart' : 'कार्ट में जोड़ने में विफल');
    } finally {
      setAdding(false);
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">
          {language === 'en' ? 'Product not found' : 'उत्पाद नहीं मिला'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={language === 'en' ? product.name_en : product.name_hi}
                className="w-full h-96 object-cover rounded-lg"
                data-testid="product-detail-image"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="product-detail-name">
                {language === 'en' ? product.name_en : product.name_hi}
              </h1>
              
              <p className="text-3xl font-bold text-green-700 mb-6" data-testid="product-detail-price">
                ₹{product.price.toFixed(2)}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Description' : 'विवरण'}
                </h3>
                <p className="text-gray-600" data-testid="product-detail-description">
                  {language === 'en' ? product.description_en : product.description_hi}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Stock' : 'स्टॉक'}
                </h3>
                <p className="text-gray-600" data-testid="product-detail-stock">
                  {product.stock > 0 
                    ? `${product.stock} ${language === 'en' ? 'units available' : 'इकाइयां उपलब्ध'}` 
                    : (language === 'en' ? 'Out of stock' : 'स्टॉक खत्म')}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Quantity' : 'मात्रा'}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    data-testid="decrease-quantity"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold" data-testid="quantity-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    data-testid="increase-quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="w-full px-8 py-4 bg-amber-900 text-white rounded-lg text-lg font-semibold hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="add-to-cart-button"
              >
                {adding ? '...' : (language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;