import api from './api';
import { User } from '../types';

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${userId}`, userData);
  return response.data;
};