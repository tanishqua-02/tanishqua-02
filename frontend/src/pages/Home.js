import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`)
      ]);
      setCategories(categoriesRes.data);
      setFeaturedProducts(productsRes.data.slice(0, 8));
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50" data-testid="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900 via-amber-800 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="hero-title">
            {language === 'en' ? 'Welcome to Krishi Kala' : 'कृषि कला में आपका स्वागत है'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">
            {language === 'en' 
              ? 'Your trusted partner for quality agricultural products' 
              : 'गुणवत्तायुक्त कृषि उत्पादों के लिए आपका विश्वसनीय साथी'}
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            data-testid="shop-now-button"
          >
            {language === 'en' ? 'Shop Now' : 'अभी खरीदें'}
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Browse by Category' : 'श्रेणी द्वारा ब्राउज़ करें'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Featured Products' : 'फीचर्ड उत्पाद'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-amber-900 text-white rounded-lg text-lg font-semibold hover:bg-amber-800 transition"
              data-testid="view-all-products-button"
            >
              {language === 'en' ? 'View All Products' : 'सभी उत्पाद देखें'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {language === 'en' ? 'Fast Delivery' : 'तेज़ डिलीवरी'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Get your products delivered quickly to your doorstep' 
                  : 'अपने उत्पाद तेज़ी से अपने घर पर प्राप्त करें'}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {language === 'en' ? 'Quality Products' : 'गुणवत्तायुक्त उत्पाद'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Only the best quality agricultural products' 
                  : 'केवल सर्वोत्तम गुणवत्ता के कृषि उत्पाद'}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {language === 'en' ? 'Secure Payment' : 'सुरक्षित भुगतान'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Safe and secure payment methods' 
                  : 'सुरक्षित और सुरक्षित भुगतान विधि'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;