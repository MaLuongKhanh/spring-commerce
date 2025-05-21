import api from './api';
import { OrderDto } from '../types/order';

const API_URL = '/orders';

export const createOrder = async (orderData: OrderDto): Promise<OrderDto> => {
    const response = await api.post(API_URL, orderData);
    return response.data;
};

export const getOrder = async (id: number): Promise<OrderDto> => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const getAllOrders = async (): Promise<OrderDto[]> => {
    const response = await api.get(API_URL);
    return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<OrderDto> => {
    const response = await api.put(`${API_URL}/${id}/status?status=${status}`);
    return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
}; 