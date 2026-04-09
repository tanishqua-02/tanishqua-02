import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="profile-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="profile-title">
          {language === 'en' ? 'My Profile' : 'मेरा प्रोफ़ाइल'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-amber-900 rounded-full flex items-center justify-center text-white text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-gray-800" data-testid="user-name">
                {user.name}
              </h2>
              <p className="text-gray-600" data-testid="user-email">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Account Information' : 'खाता जानकारी'}
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">
                  {language === 'en' ? 'Member Since:' : 'सदस्य बने:'}
                </span>
                <span className="ml-2 font-semibold" data-testid="member-since">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            data-testid="view-orders-link"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' ? 'View order history' : 'ऑर्डर हिस्ट्री देखें'}
            </p>
          </Link>

          <Link
            to="/cart"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            data-testid="view-cart-link"
          >
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'en' ? 'Shopping Cart' : 'शॉपिंग कार्ट'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' ? 'View your cart' : 'अपनी कार्ट देखें'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;