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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order order;
    private OrderDto orderDto;
    private Product product;
    private OrderItem orderItem;
    private OrderItemDto orderItemDto;

    @BeforeEach
    public void setup() {
        product = Product.builder().id(1L).name("Test Product").price(BigDecimal.TEN).build();
        orderItem = OrderItem.builder().id(1L).product(product).quantity(1).price(BigDecimal.TEN).build();
        orderItemDto = OrderItemDto.builder().productId(1L).quantity(1).productName("Test Product").productPrice(BigDecimal.TEN).build();
        List<OrderItemDto> orderItemDtos = Collections.singletonList(orderItemDto);

        order = Order.builder().id(1L).customerName("Test Customer").shippingAddress("Test Address").status(Order.OrderStatus.PENDING).orderItems(Collections.singletonList(orderItem)).totalAmount(BigDecimal.TEN).orderDate(LocalDateTime.now()).build();
        orderDto = OrderDto.builder().customerName("Test Customer").shippingAddress("Test Address").status("PENDING").orderItems(orderItemDtos).totalAmount(BigDecimal.TEN).orderDate(LocalDateTime.now()).build();
    }

    @Test
    public void givenOrderDto_whenPlaceOrder_thenReturnOrderDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDto placedOrderDto = orderService.placeOrder(orderDto);

        assertEquals(1L, placedOrderDto.getId());
        assertEquals("Test Customer", placedOrderDto.getCustomerName());
    }

    @Test
    public void givenOrderId_whenGetOrderById_thenReturnOrderDto() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        OrderDto retrievedOrderDto = orderService.getOrderById(1L);

        assertEquals(1L, retrievedOrderDto.getId());
        assertEquals("Test Customer", retrievedOrderDto.getCustomerName());
    }

    @Test
    public void givenNonExistingOrderId_whenGetOrderById_thenThrowsResourceNotFoundException() {
        when(orderRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(1L));
    }
}
