import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-amber-900 text-white shadow-lg" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="navbar-logo">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold">
              {language === 'en' ? 'Krishi Kala' : 'कृषि कला'}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-200 transition" data-testid="nav-home">
              {language === 'en' ? 'Home' : 'होम'}
            </Link>
            <Link to="/products" className="hover:text-amber-200 transition" data-testid="nav-products">
              {language === 'en' ? 'Products' : 'उत्पाद'}
            </Link>
            {user && user.is_admin && (
              <Link to="/admin" className="hover:text-amber-200 transition" data-testid="nav-admin">
                {language === 'en' ? 'Admin' : 'एडमिन'}
              </Link>
            )}
            {user && (
              <Link to="/orders" className="hover:text-amber-200 transition" data-testid="nav-orders">
                {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-amber-800 rounded hover:bg-amber-700 transition"
              data-testid="language-toggle"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative" data-testid="cart-link">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-amber-200 transition"
                  data-testid="user-menu-button"
                >
                  <span className="text-2xl">👤</span>
                  <span className="hidden md:block">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-amber-100"
                      onClick={() => setShowUserMenu(false)}
                      data-testid="profile-link"
                    >
                      {language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-amber-100"
                      data-testid="logout-button"
                    >
                      {language === 'en' ? 'Logout' : 'लॉगआउट'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition" data-testid="login-button">
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;