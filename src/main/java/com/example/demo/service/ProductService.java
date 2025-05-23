package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductDto createProduct(ProductDto productDto);
    ProductDto getProductById(Long id);
    Page<ProductDto> getAllProducts(Pageable pageable);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
    Page<ProductDto> getProductsByCriteria(
            String name,
            String categoryId,
            String brand,
            String color,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    );
    List<ProductDto> getAllProductsList(); 
}
