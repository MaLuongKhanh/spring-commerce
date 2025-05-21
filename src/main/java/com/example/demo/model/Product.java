package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.demo.config.StringArrayConverter;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name cannot be blank")
    @Column(nullable = false)
    private String name;

    private String description;

    @NotNull(message = "Price cannot be null")
    @PositiveOrZero(message = "Price must be positive or zero")
    @Column(nullable = false)
    private BigDecimal price;

    @NotBlank(message = "Brand cannot be blank")
    private String brand;

    private String color;

    @NotNull(message = "Product must have a category")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull(message = "Product must have a stock")
    @PositiveOrZero(message = "Stock must be positive or zero")
    @Column(nullable = false)
    private int stock;

    @NotNull(message = "Product must have images")
    @Convert(converter = StringArrayConverter.class)
    private String[] images;

    @NotNull(message = "Product must have sold")
    @PositiveOrZero(message = "Sold must be positive or zero")
    @Column(nullable = false)
    private int sold;
}