import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="admin-dashboard-title">
          {language === 'en' ? 'Admin Dashboard' : 'एडमिन डैशबोर्ड'}
        </h1>

        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'en' ? 'Welcome, ' : 'स्वागत है, '}{user?.name}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage your Krishi Kala e-commerce platform from here.' 
              : 'यहां से अपने कृषि कला ई-कॉमर्स प्लेटफ़ॉर्म को प्रबंधित करें।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Products */}
          <Link
            to="/admin/products"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition"
            data-testid="admin-products-link"
          >
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {language === 'en' ? 'Manage Products' : 'उत्पाद प्रबंधित करें'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Add, edit, or delete products' 
                : 'उत्पाद जोड़ें, संपादित करें या हटाएं'}
            </p>
          </Link>

          {/* View All Orders */}
          <div className="bg-white rounded-lg shadow-md p-8 opacity-75">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {language === 'en' ? 'All Orders' : 'सभी ऑर्डर'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'View and manage customer orders' 
                : 'ग्राहक ऑर्डर देखें और प्रबंधित करें'}
            </p>
            <p className="text-sm text-amber-700 mt-2">
              {language === 'en' ? '(Coming Soon)' : '(जल्द आ रहा है)'}
            </p>
          </div>

          {/* Manage Categories */}
          <div className="bg-white rounded-lg shadow-md p-8 opacity-75">
            <div className="text-5xl mb-4">🗂️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {language === 'en' ? 'Categories' : 'श्रेणियां'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Manage product categories' 
                : 'उत्पाद श्रेणियां प्रबंधित करें'}
            </p>
            <p className="text-sm text-amber-700 mt-2">
              {language === 'en' ? '(Coming Soon)' : '(जल्द आ रहा है)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;