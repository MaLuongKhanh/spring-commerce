import api from './api';
import { User, Order, Product, Category } from '../types';
import { OrderStatus } from '../types/order';

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export interface AdminUser extends User {
  enabled: boolean;
}

const adminService = {
  // Thống kê
  getDashboardStats: () => {
    return api.get<DashboardStats>('/admin/dashboard/stats');
  },

  // Quản lý người dùng
  getAllUsers: () => {
    return api.get<AdminUser[]>('/admin/users');
  },

  updateUserStatus: (userId: number, enabled: boolean) => {
    return api.put(`/admin/users/${userId}/status`, { enabled });
  },

  // Quản lý đơn hàng
  getAllOrders: () => {
    return api.get<Order[]>('/admin/orders');
  },

  updateOrderStatus: (orderId: number, status: OrderStatus) => {
    return api.put(`/admin/orders/${orderId}/status`, { status });
  },

  // Quản lý sản phẩm
  getAllProducts: () => {
    return api.get<Product[]>('/admin/products');
  },

  createProduct: (formData: FormData) => {
    return api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: (productId: number, formData: FormData) => {
    return api.put(`/admin/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: (productId: number) => {
    return api.delete(`/admin/products/${productId}`);
  },

  // Quản lý danh mục
  getAllCategories: () => {
    return api.get<Category[]>('/admin/categories');
  },
};

export default adminService; 