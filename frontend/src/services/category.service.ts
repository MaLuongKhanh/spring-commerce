import api from './api';
import { Category, ProductResponse } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const getProductsByCategory = async (categoryId: number, page: number = 0, size: number = 12): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(`/categories/${categoryId}/products`, {
    params: {
      page,
      size
    }
  });
  return response.data;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const response = await api.post('/categories', category);
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
}; 