package com.example.demo.service;

import com.example.demo.dto.OrderDto;
import com.example.demo.dto.OrderItemDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Product;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public OrderDto placeOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setCustomerName(orderDto.getCustomerName());
        order.setShippingAddress(orderDto.getShippingAddress());
        order.setStatus(Order.OrderStatus.valueOf(orderDto.getStatus()));

        // Create OrderItems and associate them with the Order
        orderDto.getOrderItems().forEach(orderItemDto -> {
            Product product = productRepository.findById(orderItemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", orderItemDto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemDto.getQuantity());
            orderItem.setPrice(product.getPrice()); // Use current price
            order.addOrderItem(orderItem);
        });

        Order savedOrder = orderRepository.save(order);

        // Convert saved Order to OrderDto
        OrderDto savedOrderDto = new OrderDto();
        savedOrderDto.setId(savedOrder.getId());
        savedOrderDto.setOrderDate(savedOrder.getOrderDate());
        savedOrderDto.setCustomerName(savedOrder.getCustomerName());
        savedOrderDto.setShippingAddress(savedOrder.getShippingAddress());
        savedOrderDto.setStatus(savedOrder.getStatus().toString());
        savedOrderDto.setOrderItems(savedOrder.getOrderItems().stream()
                .map(item -> {
                    OrderItemDto orderItemDto = new OrderItemDto();
                    orderItemDto.setId(item.getId());
                    orderItemDto.setProductId(item.getProduct().getId());
                    orderItemDto.setProductName(item.getProduct().getName());
                    orderItemDto.setProductPrice(item.getPrice());
                    orderItemDto.setQuantity(item.getQuantity());
                    return orderItemDto;
                })
                .collect(Collectors.toList()));
        savedOrderDto.setTotalAmount(savedOrder.getTotalAmount());

        return savedOrderDto;
    }

    @Override
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setCustomerName(order.getCustomerName());
        orderDto.setShippingAddress(order.getShippingAddress());
        orderDto.setStatus(order.getStatus().toString());
        orderDto.setOrderItems(order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDto orderItemDto = new OrderItemDto();
                    orderItemDto.setId(item.getId());
                    orderItemDto.setProductId(item.getProduct().getId());
                    orderItemDto.setProductName(item.getProduct().getName());
                    orderItemDto.setProductPrice(item.getPrice());
                    orderItemDto.setQuantity(item.getQuantity());
                    return orderItemDto;
                })
                .collect(Collectors.toList()));
        orderDto.setTotalAmount(order.getTotalAmount());

        return orderDto;
    }
}
