package com.example.demo.service;

import com.example.demo.dto.OrderDto;

public interface OrderService {
    OrderDto placeOrder(OrderDto orderDto); // Create new Order from DTO
    OrderDto getOrderById(Long id);
    // List<OrderDto> getOrdersByUserId(Long userId); // If we had users
}
