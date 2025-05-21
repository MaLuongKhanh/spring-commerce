import React from 'react';
import { Product } from '../types';

interface Props {
  products: Product[];
  title?: string;
}

const ProductList: React.FC<Props> = ({ products, title }) => (
  <div className="py-4">
    {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-2 bg-white">
          <img src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://via.placeholder.com/120'} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
          <div className="font-semibold">{product.name}</div>
          <div className="text-red-500 font-bold">{product.price.toLocaleString('vi-VN')}₫</div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductList; 