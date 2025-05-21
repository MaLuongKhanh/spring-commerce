import api from './api';
import { CartItem, ShoppingCart } from '../types';

export const getShoppingCart = async (userId: number): Promise<ShoppingCart> => {
  const response = await api.get(`/shopping-carts/user/${userId}`);
  return response.data;
};

export const addItemToCart = async (userId: number, productId: number, quantity: number): Promise<ShoppingCart> => {
  const response = await api.post(`/shopping-carts/user/${userId}/items`, { productId, quantity });
  return response.data;
};

export const removeItemFromCart = async (userId: number, itemId: number): Promise<ShoppingCart> => {
  const response = await api.delete(`/shopping-carts/user/${userId}/items/${itemId}`);
  return response.data;
};

export const clearShoppingCart = async (userId: number): Promise<ShoppingCart> => {
  const response = await api.delete(`/shopping-carts/user/${userId}/clear`);
  return response.data;
}; 