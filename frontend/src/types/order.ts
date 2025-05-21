export interface OrderItemDto {
    id?: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
}

export interface OrderDto {
    id?: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    orderDate?: string;
    status?: string;
    orderItems: OrderItemDto[];
    totalAmount: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
} 