package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;

    @NotNull(message = "Product ID cannot be null")
    private Long productId;

    private String productName; // Added for display
    private BigDecimal productPrice; // Added for display
    private String imageUrl; // Added for display

    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

}