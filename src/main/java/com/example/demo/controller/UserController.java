package com.example.demo.controller;

import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserDetailsServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userService;

    public UserController(UserRepository userRepository, UserDetailsServiceImpl userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id, Authentication authentication) {
        // Lấy user hiện tại từ token
        String email = authentication.getName();
        User currentUser = (User) userService.loadUserByUsername(email);

        // Lấy user theo id
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Chỉ cho phép chính mình hoặc admin
        if (!currentUser.getId().equals(id) && !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody User userData,
            Authentication authentication) {
        // Lấy user hiện tại từ token
        String email = authentication.getName();
        User currentUser = (User) userService.loadUserByUsername(email);

        // Lấy user theo id
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Chỉ cho phép chính mình hoặc admin
        if (!currentUser.getId().equals(id) && !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        // Cập nhật thông tin (không cho phép thay đổi email)
        user.setFirstname(userData.getFirstname());
        user.setLastname(userData.getLastname());
        // Giữ nguyên email và password
        user.setEmail(user.getEmail());
        user.setPassword(user.getPassword());
        user.setRole(user.getRole());

        // Lưu vào database
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(updatedUser));
    }
}