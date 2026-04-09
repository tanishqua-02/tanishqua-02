import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id);
      alert(language === 'en' ? 'Added to cart!' : 'कार्ट में जोड़ा गया!');
    } catch (error) {
      alert(language === 'en' ? 'Failed to add to cart' : 'कार्ट में जोड़ने में विफल');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block" data-testid={`product-card-${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.image}
            alt={language === 'en' ? product.name_en : product.name_hi}
            className="h-48 w-full object-cover"
            data-testid={`product-image-${product.id}`}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid={`product-name-${product.id}`}>
            {language === 'en' ? product.name_en : product.name_hi}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {language === 'en' ? product.description_en : product.description_hi}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-green-700" data-testid={`product-price-${product.id}`}>
              ₹{product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`add-to-cart-${product.id}`}
            >
              {adding ? '...' : (language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;