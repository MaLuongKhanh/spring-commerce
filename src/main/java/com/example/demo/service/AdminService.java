package com.example.demo.service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.dto.UserResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Order;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.sumTotalAmountByStatus(Order.OrderStatus.DELIVERED);
        long totalProducts = productRepository.count();

        return DashboardStatsDto.builder()
            .totalUsers(totalUsers)
            .totalOrders(totalOrders)
            .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
            .totalProducts(totalProducts)
            .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }

    public UserResponse updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setEnabled(enabled);
        userRepository.save(user);
        return UserResponse.from(user);
    }
}