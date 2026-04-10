import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductForm = ({ product, categories, onClose }) => {
  const { language } = useLanguage();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_hi: '',
    description_en: '',
    description_hi: '',
    price: '',
    category_id: '',
    image: '',
    stock: '100'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name_en: product.name_en,
        name_hi: product.name_hi,
        description_en: product.description_en,
        description_hi: product.description_hi,
        price: product.price.toString(),
        category_id: product.category_id,
        image: product.image,
        stock: product.stock.toString()
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (product) {
        // Update existing product
        await axios.put(`${API}/products/${product.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(language === 'en' ? 'Product updated successfully!' : 'उत्पाद सफलतापूर्वक अपडेट किया गया!');
      } else {
        // Create new product
        await axios.post(`${API}/products`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(language === 'en' ? 'Product created successfully!' : 'उत्पाद सफलतापूर्वक बनाया गया!');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(language === 'en' ? 'Failed to save product' : 'उत्पाद सहेजने में विफल');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="product-form-modal">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {product 
              ? (language === 'en' ? 'Edit Product' : 'उत्पाद संपादित करें')
              : (language === 'en' ? 'Add New Product' : 'नया उत्पाद जोड़ें')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            data-testid="close-form-button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Name (English)' : 'नाम (अंग्रेज़ी)'}
              </label>
              <input
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
                data-testid="name-en-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Name (Hindi)' : 'नाम (हिंदी)'}
              </label>
              <input
                type="text"
                name="name_hi"
                value={formData.name_hi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
                data-testid="name-hi-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Description (English)' : 'विवरण (अंग्रेज़ी)'}
            </label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
              data-testid="description-en-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Description (Hindi)' : 'विवरण (हिंदी)'}
            </label>
            <textarea
              name="description_hi"
              value={formData.description_hi}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
              data-testid="description-hi-input"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Price (₹)' : 'कीमत (₹)'}
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
                data-testid="price-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Stock' : 'स्टॉक'}
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
                data-testid="stock-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Category' : 'श्रेणी'}
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
                data-testid="category-select"
              >
                <option value="">{language === 'en' ? 'Select...' : 'चुनें...'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'en' ? cat.name_en : cat.name_hi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Image URL' : 'छवि URL'}
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-900 focus:border-amber-900"
              data-testid="image-input"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              data-testid="cancel-button"
            >
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              data-testid="submit-button"
            >
              {loading ? '...' : (product 
                ? (language === 'en' ? 'Update' : 'अपडेट करें')
                : (language === 'en' ? 'Create' : 'बनाएं'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
