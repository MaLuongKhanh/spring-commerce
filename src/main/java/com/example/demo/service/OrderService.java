package com.example.demo.service;

import com.example.demo.dto.OrderDto;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(OrderDto orderDto);
    OrderDto getOrderById(Long id);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long id, String status);
    void deleteOrder(Long id);
}
