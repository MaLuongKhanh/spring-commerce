import api from './api';
import { Product, ProductResponse } from '../types';

export interface ProductFilter {
  name?: string;
  categoryId?: string;
  brand?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export const getProducts = async (): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>('/products');
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const filterProducts = async (filter: ProductFilter): Promise<ProductResponse> => {
  console.log('Filtering products with criteria:', filter);
  
  const params = new URLSearchParams();
  
  if (filter.name) params.append('name', filter.name);
  if (filter.categoryId) params.append('categoryId', filter.categoryId);
  if (filter.brand) params.append('brand', filter.brand);
  if (filter.color) params.append('color', filter.color);
  if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
  if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
  if (filter.page) params.append('page', filter.page.toString());
  if (filter.size) params.append('size', filter.size.toString());

  console.log('Request URL:', `/products/filter?${params.toString()}`);
  
  try {
    const response = await api.get<ProductResponse>(`/products/filter?${params.toString()}`);
    console.log('Filter response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error filtering products:', error);
    throw error;
  }
}; 