package com.example.demo.dto;

import com.example.demo.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private LocalDateTime orderDate;
    private Order.OrderStatus status;
    private List<OrderItemDto> orderItems;
    private Double totalAmount;
}