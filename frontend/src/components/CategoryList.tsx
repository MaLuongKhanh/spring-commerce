import React from 'react';
import { Category } from '../types';

interface Props {
  categories: Category[];
}

const CategoryList: React.FC<Props> = ({ categories }) => (
  <div className="flex flex-wrap gap-4 py-4">
    {categories.map((cat) => (
      <div key={cat.id} className="flex flex-col items-center w-24">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
        <span className="text-sm text-center">{cat.name}</span>
      </div>
    ))}
  </div>
);

export default CategoryList; 