import { OrderStatus } from './order';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  enabled?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  category: Category;
  stock: number;
  imageUrls: string[];
  sold: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface ShoppingCart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
}

export interface ProductResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userFullname: string;
}

export interface CommentResponse {
  content: Comment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
}

