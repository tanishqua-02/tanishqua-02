import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CategoryCard = ({ category }) => {
  const { language } = useLanguage();

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
      data-testid={`category-card-${category.id}`}
    >
      <span className="text-5xl mb-3">{category.icon}</span>
      <h3 className="text-lg font-semibold text-gray-800 text-center" data-testid={`category-name-${category.id}`}>
        {language === 'en' ? category.name_en : category.name_hi}
      </h3>
    </Link>
  );
};

export default CategoryCard;